import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import OpenStoryEditor from '@/components/pages/Tasks/Stories/OpenStoryEditor';
import { completeCuratedTask, completeTask, findPendingCuratedTask, updateBalance } from '@/db';
import { TrackerType } from '@/trackerType';
import { redirect } from 'next/navigation';

export default async function StoryTask() {
    const { userId } = await useSession();
    const task = await prisma.$transaction(async tx => {
        const task = await findPendingCuratedTask(tx, userId, TrackerType.PublishStory, []);

        if (!task) return task;

        const { taskId } = await completeCuratedTask(tx, task.id);
        await completeTask(tx, taskId, userId);
        await updateBalance(tx, userId, task.totalReward);

        return task;
    });

    if (!task) redirect('/tasks');

    return (
        <>
            <OpenStoryEditor url={task.task.url}/>
        </>
    );
}