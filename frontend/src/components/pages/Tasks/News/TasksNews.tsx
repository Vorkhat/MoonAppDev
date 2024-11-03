import React from 'react';
import styles from './styles.module.scss';
import { TaskProps } from '@/app/(content)/tasks/page';
import { prisma } from '@/prisma';
import { getCurrentSessionLanguage } from '@/locale/locale';
import { JsonObject } from '@prisma/client/runtime/library';
import TaskItem from '@/components/pages/Tasks/News/TaskItem.tsx';

export async function TasksNews({ tasks }: TaskProps) {
    const language = await getCurrentSessionLanguage();

    const visibleTasks = tasks.filter(task => task.isVisible);
    const taskItems = await Promise.all(visibleTasks.map(async (task) => {
        const data = task.task.data as JsonObject;
        const description = await prisma.localizationValue.findUnique({
            where: {
                id_language: {
                    id: Number(data.description),
                    language,
                },
            },
            select: {
                value: true,
            },
        });
        return {
            id: task.id,
            iconType: String(data.iconType),
            description: description?.value || 'Undefined',
            totalReward: task.totalReward,
            url: task.task.url,
            amount: task.totalReward
        };
    }));

    return (
        <div className={styles.tasksItems}>
            {taskItems.map(task => (
                <TaskItem
                    key={task.id}
                    id={task.id}
                    iconType={task.iconType}
                    description={task.description}
                    totalReward={task.totalReward}
                    url={task.url}
                    amount={task.amount}
                />
            ))}
        </div>
    );
}

export default TasksNews;