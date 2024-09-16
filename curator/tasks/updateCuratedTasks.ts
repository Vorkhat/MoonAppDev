import { prisma } from '@/index';
import { CuratedTaskCategory, PrismaClient, TaskType } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { JsonObject } from '@prisma/client/runtime/library';
import { TrackerType } from '@/trackerType';

export default async function () {
    await prisma.$transaction(async tx => {
        await tx.curatedTask.deleteMany({
            where: {
                task: {
                    type: { not: TaskType.Invite },
                },
                OR: [
                    {
                        startedAt: { equals: null },
                        completedAt: { equals: null },
                    },
                    {
                        startedAt: { not: null },
                        completedAt: { not: null },
                    },
                    {
                        startedAt: { gte: new Date(new Date().getTime() - 10 * 60 * 1000) },
                        completedAt: { equals: null },
                    },
                ],
            },
        });

        const users = await tx.user.findMany({
            select: {
                id: true,
            },
        });

        for (const { id } of users) {
            await createCuratedTasks(tx, id);
        }
    });
}

export async function createCuratedTasks(tx: Omit<PrismaClient, runtime.ITXClientDenyList>, id: number | bigint) {
    const tasks = await tx.task.findMany({
        where: {
            AND: [
                {
                    OR: [
                        {
                            completions: {
                                none: {
                                    userId: id,
                                },
                            },
                        },
                        {
                            data: {
                                path: [ 'repeatable' ],
                                equals: true,
                            },
                        },
                    ],
                },
                {
                    tracker: {
                        data: {
                            path: [ 'type' ],
                            not: TrackerType.Invite,
                        },
                    },
                },
            ],
        },
        select: {
            id: true,
            reward: true,
            scaling: true,
            tracker: {
                select: {
                    data: true,
                },
            },
        },
    });

    if (!tasks.length) return;

    await tx.curatedTask.createMany({
        data: await Promise.all(tasks.map(async task => {
            const completionCount = await tx.taskCompletion.count(
                { where: { taskId: task.id, userId: id } });

            const trackerType = (task.tracker.data as JsonObject).type as TrackerType;

            let category: CuratedTaskCategory;
            if (trackerType === TrackerType.External) {
                category = CuratedTaskCategory.Sponsored;
            }
            else if (completionCount === 0) {
                category = CuratedTaskCategory.New;
            }
            else {
                category = CuratedTaskCategory.Daily;
            }

            return {
                userId: id,
                taskId: task.id,
                category: category,
                totalReward: task.reward /*+ completionCount * task.scaling*/,
            };
        })),
    });
}