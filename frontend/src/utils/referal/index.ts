import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export default async function ReferalSystem(referalId: number) {
    const user = await prisma.invitation.findFirst(
        {
            where: { userId: referalId },
        },
    );

    if (!user) {
        await prisma.invitation.create({
            data: {
                userId: referalId,
                useCount: 1
            }
        });
    }

    else {
        await prisma.invitation.updateMany({
            where: {
                userId: referalId,
            },
            data: {
                useCount: {
                    increment: 1,
                },
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}