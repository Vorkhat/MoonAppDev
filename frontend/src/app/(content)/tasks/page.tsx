import './theme.scss'
import styles from './styles.module.scss';
import TasksNews from '@/components/pages/Tasks/News/TasksNews.tsx';
import TasksReferral from '@/components/pages/Tasks/Referral/TasksReferral.tsx';
import PartnersTasks from '@/components/pages/Tasks/Partners/PartnersTasks.tsx';
import TasksLinks from '@/components/pages/Tasks/Links/TasksLinks.tsx';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { CuratedTask, CuratedTaskCategory, Task } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { JsonObject } from '@prisma/client/runtime/library';

export interface TaskProps {
    tasks: (CuratedTask & { task: Task })[];
}

export default async function Tasks() {
    const { userId } = await useSession();
    const tasks = await prisma.curatedTask.findMany({
        where: {
            userId: userId,
        },
        include: {
            task: true,
        },
        orderBy: {
            totalReward: 'desc',
        },
    });

    const completeTasks = await prisma.taskCompletion.findMany({
        where: {
            userId: userId,
        },
    });

    console.log(completeTasks);

    const completedTaskIds = new Set(completeTasks.map(completion => completion.taskId.toString()));

    const newTasks = tasks.filter(t =>
        t.category === CuratedTaskCategory.New && !completedTaskIds.has(t.taskId.toString())
    );
    const sponsoredTasks = tasks.filter(t =>
        t.category === CuratedTaskCategory.Sponsored && !completedTaskIds.has(t.taskId.toString())
    );
    const internalTasks = tasks.filter(t =>
        t.category === CuratedTaskCategory.Internal && !completedTaskIds.has(t.taskId.toString())
    );

    const sponsoredTasksData = sponsoredTasks.map(t => {
        return {
            url: t.task.url,
            data: t.task.data as JsonObject,
            reward: t.task.reward,
        };
    });

    const internalTasksData = internalTasks.map(t => {
        return {
            url: t.task.url,
            data: t.task.data as JsonObject,
            reward: t.task.reward,
        };
    });

    const translator = await getTranslations('Tasks');

    return (
        <div className={styles.tasksPage}>
            <div className={styles.headerContainer}>
                <p className={styles.headerText}>
                    <span className={styles.textNormal}>{translator('header.title')}</span>
                    <span className={styles.textNormal}>{translator('header.content')} <span className={styles.textColor}>{translator('header.footer')}!</span>
                    </span>
                </p>
            </div>
            <div className={styles.mainContainer}>
                {newTasks && newTasks.length ?
                 <div className={styles.tasksNews}>
                     <h3 style={{ fontWeight: 'bold' }}>New 🔥</h3>
                     <TasksNews tasks={newTasks}/>
                 </div>
                                             : <></>
                }
                <div className={styles.tasksDaily}>
                    <TasksReferral/>
                </div>
                {sponsoredTasks.length > 0 && (
                    <div className={styles.tasksPartners}>
                        <h3 style={{ fontWeight: 'bold' }}>{translator('content.partners.title')}</h3>
                        <PartnersTasks data={sponsoredTasksData}/>
                    </div>
                )}
                {internalTasks.length > 0 && (<TasksLinks data={internalTasksData}/>)}
            </div>
        </div>
    );
};