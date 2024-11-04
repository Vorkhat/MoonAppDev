import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';
import updateCuratedTasks, { createCuratedTasks, createCuratedTasksForTask } from './tasks/updateCuratedTasks';
import collectTopSnapshot from '@/tasks/collectTopSnapshot';
import { consumeMessages, MessageQueue } from '../frontend/src/mq.js';

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

await consumeMessages<{ taskId: number }>(MessageQueue.NewTask, async ({ taskId }) => {
    console.log('New task', taskId);
    await prisma.$transaction(async tx => {
        await createCuratedTasksForTask(tx, taskId);
    });
});