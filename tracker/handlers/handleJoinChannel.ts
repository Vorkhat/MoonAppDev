import { prisma } from '@/prisma';
import { completeCuratedTask, completeTask, findPendingCuratedTask } from '@/db';
import { TrackerType } from '@/trackerType';
import updateBalance from '@/db/updateBalance';

export default async function (channelId: number, userId: bigint | number) {
    return prisma.$transaction(async tx => {
        const task = await findPendingCuratedTask(tx,
                                                  userId,
                                                  TrackerType.JOIN_CHANNEL,
                                                  {
                                                      data: {
                                                          path: [ 'channelId' ],
                                                          equals: channelId,
                                                      },
                                                  });

        if (!task) {
            return;
        }

        const { taskId } = await completeCuratedTask(tx, task.id);
        await completeTask(tx, taskId, userId);
        await updateBalance(tx, userId, task.totalReward);
    });
}