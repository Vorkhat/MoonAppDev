import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { TaskProps } from '@/app/tasks/page.tsx';
import { Task } from '@prisma/client/';
import { currencyName } from '@/utils/constants.ts';

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
        <a className={styles.task__gradient} href={disabled ? undefined : `/api/task/${id}`}
           target={disabled ? undefined : '_blank'}>
            <div className={styles.task__item}>
                <Image className={styles.task__image} src={mapTaskIcon(task)} width={44} height={44} alt={'/'}/>
                <div className={`${styles.task__text} ${inter.className}`} style={{}}>{task.type}</div>
                <div className={`${styles.task__award} ${inter.className}`}>+{totalReward} {currencyName}</div>
            </div>
        </a>
    );
}

export function TasksNews({ tasks }: TaskProps) {
    return (
        <>
            <div className={styles.tasks__items}>
                {tasks.map(task => (
                    <TaskItem key={task.id} id={task.id} task={task.task} totalReward={task.totalReward}/>
                ))}
            </div>
        </>
    );
}

export default TasksNews;