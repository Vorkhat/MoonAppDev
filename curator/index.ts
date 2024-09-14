import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';
import updateCuratedTasks from './tasks/updateCuratedTasks';
import collectTopSnapshot from '@/tasks/collectTopSnapshot';

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