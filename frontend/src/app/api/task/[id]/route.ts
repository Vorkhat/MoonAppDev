import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';

export async function POST(req: NextRequest, { params }: { params: { id: number } }): Promise<NextResponse> {
    const session = await useSession();

    const task = await prisma.curatedTask.findUnique({
                                                         where: {
                                                             id: params.id,
                                                             userId: session.userId,
                                                             startedAt: null,
                                                             completedAt: null,
                                                         },
                                                         include: {
                                                             task: {
                                                                 select: {
                                                                     url: true,
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

    return NextResponse.redirect(task.task.url);
}