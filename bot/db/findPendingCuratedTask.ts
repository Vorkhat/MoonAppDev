import { Prisma, PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { TrackerType } from '@/trackerType';

export default async function (
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    userId: bigint | number,
    type: TrackerType | string,
    filter: Prisma.TaskTrackerWhereInput | Prisma.TaskTrackerWhereInput[],
) {
    const selector: Prisma.TaskTrackerWhereInput[] = [
        {
            data: {
                path: [ 'type' ],
                equals: type,
            },
        },
    ];

    if (filter instanceof Array) {
        selector.push(...filter);
    }
    else {
        selector.push(filter);
    }

    return tx.curatedTask.findFirst({
        where: {
            startedAt: {},
            completedAt: null,
            userId: userId,
            task: {
                tracker: {
                    AND: selector,
                },
            },
        },
        include: {
            task: true,
        },
    });
}