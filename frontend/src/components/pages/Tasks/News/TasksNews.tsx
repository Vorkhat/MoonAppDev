import React from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { TaskProps } from '@/app/(content)/tasks/page.tsx';
import { Task } from '@prisma/client/';
import { currencyName } from '@/utils/constants.ts';
import { JsonObject } from '@prisma/client/runtime/library';
import { prisma } from '@/prisma';
import Link from 'next/link';
import { getCurrentSessionLanguage } from '@/locale/locale';
import ContainerColor from '@/common/ContainerColor';


export function mapTaskIcon(task: Task) {
    return TasksIcon.REPOST; // todo task icons mapping
}

export async function TaskItem({ id, task, totalReward, disabled }: {
    id: bigint,
    task: Task,
    totalReward: number,
    disabled?: true
}) {
    const data = task.data as JsonObject;
    const description = await prisma.localizationValue.findUnique({
        where: {
            id_language: {
                id: Number(data.description),
                language: await getCurrentSessionLanguage(),
            },
        },
        select: {
            value: true,
        },
    });

    return (
        <ContainerColor classNameBorder={[styles.taskBorder, 'fit-conteiner']}
                        classNameBackground={styles.taskBackground}>
            <Link className={styles.taskItem} href={disabled ? '' : `/api/task/${id}`}>
                <Image className={styles.taskImage}
                       src={data.iconType ? TasksIcon[data.iconType as keyof typeof TasksIcon] : mapTaskIcon(task)}
                       width={44} height={44} alt={'/'}/>
                <div className={styles.taskText}
                     style={{}}>{description?.value || 'Undefined'}</div>
                <ContainerColor
                    classNameBorder={[styles.rewardValueBorder, 'fit-conteiner']}
                    classNameBackground={[styles.rewardValueBackground, 'text-litle-container']}
                >
                    +{totalReward} {currencyName}
                </ContainerColor>
            </Link>
        </ContainerColor>
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