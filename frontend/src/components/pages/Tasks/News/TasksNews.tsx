import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { TaskProps } from '@/app/tasks/page.tsx';
import { Task } from '@prisma/client/';
import { currencyName } from '@/utils/constants.ts';
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';

const inter = Inter({ subsets: [ 'latin' ] });

export function mapTaskIcon(task: Task) {
    return TasksIcon.REPOST; // todo task icons mapping
}

export function TaskItem({ id, task, totalReward, disabled }: {
    id: bigint,
    task: Task,
    totalReward: number,
    disabled?: true
}) {
    return (
        <a className={styles.taskGradient} href={disabled ? undefined : `/api/task/${id}`}
           target={disabled ? undefined : '_blank'}>
            <div className={styles.taskItem}>
                <Image className={styles.taskImage} src={mapTaskIcon(task)} width={44} height={44} alt={'/'}/>
                <div className={`${styles.taskText} ${inter.className}`} style={{}}>{task.type}</div>
                <AwardComponent>+{totalReward} {currencyName}</AwardComponent>
            </div>
        </a>
    );
}

export function TasksNews({ tasks }: TaskProps) {
    return (
        <>
            <div className={styles.tasksItems}>
                {tasks.map(task => (
                    <TaskItem key={task.id} id={task.id} task={task.task} totalReward={task.totalReward}/>
                ))}
            </div>
        </>
    );
}

export default TasksNews;