'use server';

import { prisma } from '@/prisma.ts';
import { Task, TaskType } from '@prisma/client';
import styles from './page.module.scss';
import React from 'react';

export default async function TaskView({ params }: { params: { taskId: number } }) {
    let task: Task | null = await prisma.task.findUnique({
                                                             where: {
                                                                 id: params.taskId,
                                                             },
                                                         });

    async function createTask(formData: FormData) {
        'use server';

        const data = Object.fromEntries(formData) as unknown as Task;

        if (params.taskId < 0) {
            await prisma.task.create({
                                         data: data,
                                     });
        }
        else {
            await prisma.task.update({
                                         where: {
                                             id: params.taskId,
                                         },
                                         data: data,
                                     });
        }
    }

    return (
        <>
            <form className={styles.task} action={createTask}>
                <div>
                    <label htmlFor="type">Type</label>
                    <input type="text" name="type" list="typeList" defaultValue={task?.type}/>
                    <datalist id="typeList">
                        {Object.entries(TaskType).map(type => (
                            <option key={type[0]} value={type[1]}/>
                        ))}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <input type="url" name="url" defaultValue={task?.url}/>
                </div>
                <div>
                    <label htmlFor="reward">Reward</label>
                    <input type="number" name="reward" defaultValue={task?.reward ?? 100} min={0}/>
                </div>
                <div>
                    <label htmlFor="scaling">Scaling</label>
                    <input type="number" name="scaling" defaultValue={task?.scaling ?? 1} min={0} max={1} step={0.05}/>
                </div>
                {/*<TrackerInputButton defaultValue={task?.trackerId.toString()}>
                    Edit tracker
                </TrackerInputButton>*/}
                <div>
                    <label htmlFor="trackerId">Tracker</label>
                    <input type="text" name="trackerId" defaultValue={task?.trackerId?.toString()}/>
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}