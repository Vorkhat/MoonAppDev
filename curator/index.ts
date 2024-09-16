import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';
import updateCuratedTasks, { createCuratedTasks } from './tasks/updateCuratedTasks';
import collectTopSnapshot from '@/tasks/collectTopSnapshot';
import { consumeMessages, MessageQueue } from '@/mq';

export const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
    schedule('0 0 * * *', async () => {
        await collectTopSnapshot();
        await updateCuratedTasks();
    });
}
else {
    await collectTopSnapshot();
    await updateCuratedTasks();
}

await consumeMessages<{ userId: number }>(MessageQueue.NewUser, async ({ userId }) => {
    console.log('New user', userId);
    await prisma.$transaction(async tx => {
        await createCuratedTasks(tx, userId);
    });
});