'use client'

import React from 'react';
import styles from './styles.module.scss';
import { Icon, taskIconMapping } from '../tasksIcon.ts';
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';
import { currencyName } from '@/utils/constants.ts';
import Image from 'next/image';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export function mapTaskIcon(task: string): Icon | undefined {
    const icon = taskIconMapping[task.toUpperCase()];
    if (!icon) {
        console.warn(`Icon for task '${task}' is not defined.`);
    }
    return icon;
}

type InternalProps = {
    id: bigint,
    url: string;
    data: JsonObject;
    reward: number;
};

const CreateItem = ({id, url, data, reward }: InternalProps) => {
    const iconType = typeof data.iconType === 'string' ? data.iconType : 'Undefined';
    const translate = useTranslations('Tasks');
    let text = translate(`content.others.web`)

    const check = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const lp = retrieveLaunchParams();
        await fetch('/api/updateBalance', {
            method: 'POST',
            body: JSON.stringify({
                initDataRaw: lp.initDataRaw,
                amount: Number(reward),
                taskId: Number(id)
            }),
        });

        window.Telegram.WebApp.openLink(url)
    };

    if (data.iconType == 'INSTAGRAM') {
        text = translate(`content.others.instagram`)
    }

    return (
        <ContainerColor classNameBorder={styles.taskLinkBorder} classNameBackground={styles.taskLinkBackground}>
            <a className={styles.taskLink} href={url} onClick={check}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={mapTaskIcon(iconType)} width={23} height={23} alt="/" />
                    <span className={styles.linkText}>
                        {text}
                    </span>
                </div>
                <h6 className={styles.rewardValue}>{reward} {currencyName}</h6>
            </a>
        </ContainerColor>
    );
};

const TasksLinks = ({ data }: { data: InternalProps[] }) => {
    return (
        <div className={styles.taskListLink}>
            {data.map((item, index) => (
                <CreateItem key={index} {...item} />
            ))}
        </div>
    );
};

export default TasksLinks;
