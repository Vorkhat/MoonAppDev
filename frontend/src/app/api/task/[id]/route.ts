import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { JsonObject } from '@prisma/client/runtime/library';
import { TrackerType } from '@/trackerType';

export async function GET(req: NextRequest, { params }: { params: { id: number } }): Promise<NextResponse> {
    const session = await useSession();

    const task = await prisma.curatedTask.findUnique({
        where: {
            id: params.id,
            userId: session.userId,
            completedAt: null,
        },
        include: {
            task: {
                select: {
                    url: true,
                    tracker: {
                        select: {
                            data: true,
                        },
                    },
                },
            },
        },
    });

    if (!task) {
        return new NextResponse(null, { status: 404, statusText: 'Task not found' });
    }

    await prisma.curatedTask.update({
        where: {
            id: params.id,
            userId: session.userId,
        },
        data: {
            startedAt: new Date(),
        },
    });

    if ((task.task.tracker.data as JsonObject).type as TrackerType === TrackerType.PublishStory) {
        return NextResponse.json({status: 200})
    }

    return NextResponse.redirect(`https://${req.headers.get('host')}/tasks`)
}