import React from 'react';
import styles from './styles.module.scss';
import { Icon, taskIconMapping, TasksIconMapper } from '../tasksIcon.ts';
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';
import OpenUrlButton from '@/components/pages/Tasks/OpenUrlButton.tsx';
import { currencyName } from '@/utils/constants.ts';
import Image from 'next/image';


export function mapTaskIcon(task: string): Icon | undefined {
    const icon = taskIconMapping[task.toUpperCase()];
    if (!icon) {
        console.warn(`Icon for task '${task}' is not defined.`);
    }
    return icon;
}

type InternalProps = {
    url: string;
    data: JsonObject;
    reward: number
};

const CreateItem = ({ url, data, reward }: InternalProps) => {

    const iconType = typeof data.iconType === 'string' ? data.iconType : 'Undefined';
    const translarot = useTranslations('Tasks');

    return (
        <ContainerColor classNameBorder={styles.taskLinkBorder} classNameBackground={styles.taskLinkBackground}>
            <OpenUrlButton className={styles.taskLink} href={url}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Image src={mapTaskIcon(iconType)} width={23} height={23} alt="/"/>
                    <span className={styles.linkText}>
                        {translarot(`content.others.${'web'}`)}
                    </span>
                </div>
                <h6 className={styles.rewardValue}>{reward} {currencyName}</h6>
            </OpenUrlButton>
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