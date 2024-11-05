'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';
import { currencyName } from '@/utils/constants.ts';
import { Icon, taskIconMapping } from '@/components/pages/Tasks/tasksIcon.ts';
import ContainerColor from '@/common/ContainerColor.tsx';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { postEvent } from '@telegram-apps/sdk';

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

    const checkStroty = async () => {
        if (iconType == 'REPOST') {
            postEvent(
                'web_app_share_to_story', {
                    media_url: String(url),
                    text: `Друг, подпишись на бота фитнес приложения MotionFan если хочешь получать USDT и подарки на шаги, участие в челленджах и выполнение заданий в боте + ссылка t.me/motionfan`,
                    widget_link: {
                        url: `https://t.me/motionfan`,
                        name: 'Moon App',
                    },
                }
            )
            const lp = retrieveLaunchParams();
            await fetch('/api/updateBalance', {
                method: 'POST',
                body: JSON.stringify({
                    initDataRaw: lp.initDataRaw,
                    amount: Number(amount),
                    taskId: Number(id)
                }),
            });

        }
        else {
            await fetch(`/api/task/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    };

    return (
        <ContainerColor classNameBorder={[ styles.taskBorder, 'fit-conteiner' ]} classNameBackground={styles.taskBackground}>
            <Link className={styles.taskItem} href={iconType == "REPOST" ? '' : url} onClick={checkStroty}>
                <Image className={styles.taskImage} src={mapTaskIcon(iconType)} width={44} height={44} alt={'/'}/>
                <div className={styles.taskText}>{description || 'Undefined'}</div>
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
