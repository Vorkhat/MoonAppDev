import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';
import { sessionTtl, useSession } from '@/components/session';
import { prisma } from '@/prisma.ts';
import '@/envConfig.ts';
import { parseInitData } from '@telegram-apps/sdk';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const initDataRaw = await req.text();
    const initData = parseInitData(initDataRaw);

    if (!process.env.BOT_TOKEN) {
        throw new Error('Missing BOT_TOKEN environment variable');
    }

    try {
        validate(initDataRaw, process.env.BOT_TOKEN, { expiresIn: sessionTtl });
    } catch (validationError: any) {
        if (process.env.NODE_ENV === 'production') {
            return new NextResponse(null, { status: 400, statusText: validationError });
        }
    }

    const session = await useSession();

    session.userId = initData.user!.id;
    session.username = initData.user!.username;
    session.firstName = initData.user!.firstName;
    session.lastName = initData.user!.lastName;
    session.privileged = process.env.NODE_ENV === 'development';
    session.language = initData.user!.languageCode === 'ru' ? 'Ru' : 'En';

    const userName = session.lastName ? `${session.firstName} ${session.lastName}` : session.firstName;

    await prisma.$transaction(async tx => {
        if (await tx.user.findUnique({ where: { id: session.userId } })) {
            await tx.user.update({
                where: { id: session.userId },
                data: {
                    name: userName,
                },
            });
        }
        else {
            try {
                await tx.user.create({
                    data: {
                        id: session.userId,
                        language: session.language,
                        name: userName,
                        invitations: {
                            create: {},
                        },
                    },
                });
            } catch (error) {
                // in case we got multiple parallel requests
                if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                    return;
                }
                throw error;
            }

            if (initData.startParam) {
                const refId = /^ref(\d+)$/.exec(initData.startParam)?.at(1);

                if (refId) {
                    await prisma.invitation.update({
                        where: {
                            id: parseInt(refId),
                        },
                        data: {
                            useCount: { increment: 1 },
                        },
                    });
                }
            }
        }
    });

    await session.save();

    return new NextResponse(null, { status: 204 });
}