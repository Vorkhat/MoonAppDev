import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import TasksNews from '@/components/pages/Tasks/News/TasksNews.tsx';
import TasksReferral from '@/components/pages/Tasks/Referral/TasksReferral.tsx';
import PartnersTasks from '@/components/pages/Tasks/Partners/PartnersTasks.tsx';
import TasksLinks from '@/components/pages/Tasks/Links/TasksNews.tsx';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { CuratedTask, CuratedTaskCategory, Task } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { JsonObject } from '@prisma/client/runtime/library';

const inter = Inter({ subsets: [ 'latin' ] });

export interface TaskProps {
    tasks: (CuratedTask & { task: Task })[];
}

export async function getCuratedTasks() {
    const session = await useSession();

    return prisma.curatedTask.findMany({
        where: {
            userId: session.userId,
        },
        include: {
            task: true,
        },
        orderBy: {
            totalReward: 'desc',
        },
    });
}

export default async function Tasks() {
    const tasks = await getCuratedTasks();

    const newTasks = tasks.filter((t) => t.category === CuratedTaskCategory.New);
    const sponsoredTasks = tasks.filter((t) => t.category === CuratedTaskCategory.Sponsored);
    const internalTasks = tasks.filter((t) => t.category === CuratedTaskCategory.Internal);

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

    const t = await getTranslations('Tasks');

    return (
        <div className={styles.tasks__page}>
            <div className={`${styles.header__container}  ${inter.className}`}>
                <p className={styles.header__text}>
                    <span className={styles.text_normal}>{t('header.title')}</span>
                    <span className={styles.text_normal}>{t('header.content')} <span
                        className={styles.text__color}>{t('header.footer')}!</span></span>
                </p>
            </div>
            <div className={styles.main__container}>
                {newTasks && newTasks.length ?
                 <div className={styles.tasks__news}>
                     <h3>New 🔥</h3>
                     <TasksNews tasks={newTasks}/>
                 </div>
                                             : <></>
                }
                <div className={styles.tasks__daily}>
                    <TasksReferral/>
                </div>
                {sponsoredTasks.length > 0 && (
                    <div className={styles.partners}>
                        <h3>{t('content.partners.title')}</h3>
                        <PartnersTasks data={sponsoredTasksData}/>
                    </div>
                )}
                {internalTasks.length > 0 && (<TasksLinks data={internalTasksData}/>)}
            </div>
        </div>
    );
};