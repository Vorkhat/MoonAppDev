import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';
import { sessionTtl, useSession } from '@/components/session';
import { prisma } from '@/prisma.ts';
import '@/envConfig.ts';
import { parseInitData } from '@telegram-apps/sdk';
import * as runtime from '@prisma/client/runtime/library';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Language, PrismaClient } from '@prisma/client';
import { TrackerType } from '@/trackerType';
import { setCurrentSessionLanguage } from '@/locale/locale';
import { MessageQueue, publishMessage } from '@/mq';

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
            console.error("err", validationError.message || validationError);
            console.error("err:", validationError.stack);
            console.error("err", initDataRaw);

            return new NextResponse(null, {
                status: 400,
                statusText: "err" + (validationError.message || "r"),
            });
        } else {
            console.error("er", validationError);
            return new NextResponse(JSON.stringify({
                error: "Ошибка валидации",
                message: validationError.message,
                stack: validationError.stack,
                initDataRaw: initDataRaw,
                sessionTtl: sessionTtl
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    const session = await useSession();

    session.userId = initData.user!.id;
    session.username = initData.user!.username;
    session.firstName = initData.user!.firstName;
    session.lastName = initData.user!.lastName;
    session.privileged = process.env.NODE_ENV === 'development';

    let language = initData.user!.languageCode === 'ru' ? Language.Ru : Language.En;

    const userName = session.lastName ? `${session.firstName} ${session.lastName}` : session.firstName;

    await prisma.$transaction(async tx => {
        if (await tx.user.findUnique({ where: { id: session.userId } })) {
            const user = await tx.user.update({
                where: { id: session.userId },
                data: {
                    name: userName,
                },
                select: {
                    language: true,
                },
            });

            language = user.language;
        }
        else {
            try {
                await tx.user.create({
                    data: {
                        id: session.userId,
                        language: language,
                        name: userName,
                        invitations: {
                            create: {},
                        },
                    },
                });

                await publishMessage(MessageQueue.NewUser, { userId: session.userId });
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
                    const ref = await tx.invitation.update({
                        where: {
                            id: parseInt(refId),
                        },
                        data: {
                            useCount: { increment: 1 },
                        },
                        select: {
                            useCount: true,
                            userId: true,
                        },
                    });

                    await dispatchRefTaskCompletion(tx, ref.userId, ref.useCount);
                }
            }
        }
    });

    await session.save();

    await setCurrentSessionLanguage(language);

    return new NextResponse(null, { status: 204 });
}

async function dispatchRefTaskCompletion(
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>, refUserId: bigint | number, useCount: number) {
    const tasks = await tx.task.findMany({
        where: {
            tracker: {
                data: {
                    path: [ 'type' ],
                    equals: TrackerType.Invite,
                },
            },
            OR: [
                {
                    tracker: {
                        data: {
                            path: [ 'repeatable' ],
                            equals: true,
                        },
                    },
                },
                {
                    completions: {
                        none: { userId: refUserId },
                    },
                    tracker: {
                        data: {
                            path: [ 'useCount' ],
                            equals: useCount,
                        },
                    },
                },
            ],
        },
        select: {
            id: true,
            reward: true,
            scaling: true,
        },
    });

    await tx.user.update({
        where: { id: refUserId },
        data: {
            points: {
                increment: tasks.reduce((total, task) => total + task.reward, 0),
            },
        },
    });

    for (const task of tasks) {
        await tx.task.update({
            where: { id: task.id },
            data: {
                completions: {
                    create: {
                        user: { connect: { id: refUserId } },
                    },
                },
            },
        });
    }
}