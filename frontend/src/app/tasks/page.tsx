import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import TasksNews from '@/components/Tasks/News/TasksNews.tsx';
import TasksReferral from '@/components/Tasks/Referral/TasksReferral.tsx';
import PartnersTasks from '@/components/Tasks/Partners/PartnersTasks.tsx';
import TasksLinks from '@/components/Tasks/Links/TasksNews.tsx';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { CuratedTask, CuratedTaskCategory, Task } from '@prisma/client';

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

    const newTasks = tasks.filter(t => t.category === CuratedTaskCategory.New);

    return (
        <div className={styles.tasks__page}>
            <header className={styles.header__container}>
                <div className={styles.header__text}>
                    <p className={`${styles.text_normal} ${inter.className}`}>Выполняй задания и </p>
                    <p className={`${styles.text_normal} ${inter.className}`}>
                        получай
                        <span className={`${styles.text__color} ${inter.className}`}> баллы!</span>
                    </p>
                </div>
            </header>
            <main className={styles.main__container}>
                {newTasks && newTasks.length ?
                 <div className={styles.tasks__news}>
                     <h3>New 🔥</h3>
                     <TasksNews tasks={newTasks}/>
                 </div>
                                             : <></>
                }
                <div className={styles.tasks__daily}>
                    <h3>Ежедневные 🎯</h3>
                    <TasksReferral/>
                </div>
                <div className={styles.partners}>
                    <h3>Наши партнеры 💼</h3>
                    <PartnersTasks/>
                </div>
                <TasksLinks/>
            </main>
        </div>
    );
};