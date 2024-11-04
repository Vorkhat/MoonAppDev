'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';
import { currencyName } from '@/utils/constants.ts';
import { Icon, taskIconMapping } from '@/components/pages/Tasks/tasksIcon.ts';
import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import ContainerColor from '@/common/ContainerColor.tsx';

export function mapTaskIcon(task: string): Icon | undefined {
    const icon = taskIconMapping[task.toUpperCase()];
    if (!icon) {
        console.warn(`Icon for task '${task}' is not defined.`);
    }
    return icon;
}

export default function TaskItem({
                                     id,
                                     iconType,
                                     description,
                                     totalReward,
                                     url,
                                     amount
                                 }: {
    id: bigint,
    iconType: string,
    description: string,
    totalReward: number,
    amount: number,
    url: string
}) {

    const checkStroty = () => {
        if (iconType == 'REPOST') {
            postEvent('web_app_share_to_story' as any, {
                media_url: url,
                text: `Друг, подпишись на бота фитнес приложения MotionFan если хочешь получать USDT и подарки на шаги, участие в челленджах и выполнение заданий в боте + ссылка t.me/motionfan`,
            });
            const lp = retrieveLaunchParams();
            fetch('/api/updateBalance', {
                method: 'POST',
                body: JSON.stringify({
                    initDataRaw: lp.initDataRaw,
                    amount: Number(amount),
                    taskId: Number(id)
                }),
            });

        }
    };

    return (
        <ContainerColor classNameBorder={[ styles.taskBorder, 'fit-conteiner' ]} classNameBackground={styles.taskBackground}>
            <Link className={styles.taskItem} href={url}  onClick={checkStroty}>
                <Image className={styles.taskImage} src={mapTaskIcon(iconType)} width={44} height={44} alt={'/'}/>
                <div className={styles.taskText}>{description || 'Undefined'}</div>
                <h6 className={`${styles.reward} gradient-border`}>+{totalReward} {currencyName}</h6>
            </Link>
        </ContainerColor>
    );
}
