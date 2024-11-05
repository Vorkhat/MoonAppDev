import { NextRequest, NextResponse } from 'next/server';
import { validate } from '@telegram-apps/init-data-node';
import { sessionTtl, useSession } from '@/components/session';
import '@/envConfig.ts';
import { parseInitData } from '@telegram-apps/sdk';
import { prisma } from '@/prisma.ts';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { initDataRaw, amount, taskId } = await req.json();
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

    const completedTasks = await prisma.taskCompletion.findMany({
        where: {
            userId: session.userId,
            taskId: Number(taskId),
        }
    });

    if (completedTasks.length > 0) {
        return new NextResponse(null, { status: 409, statusText: 'Task already completed' });
    }

    console.log(taskId, session.userId)
    await prisma.taskCompletion.create({
        data: {
            taskId: Number(taskId),
            userId: Number(session.userId),
        },
    });

    await prisma.user.updateMany({
        where: { id: Number(session.userId) },
        data: { points: { increment: Number(amount) } },
    });

    return new NextResponse(null, { status: 204 });
}
