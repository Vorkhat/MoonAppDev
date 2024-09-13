import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';
import updateCuratedTasks from './tasks/updateCuratedTasks';

export const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
    schedule('0 0 * * *', updateCuratedTasks);
}
else {
    await updateCuratedTasks();
}