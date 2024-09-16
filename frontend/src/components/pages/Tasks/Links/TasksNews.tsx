import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';


export function mapTaskIcon(task: string) {
    return TasksIcon.WEB; // todo task icons mapping
}

type InternalProps = {
    url: string;
    data: JsonObject;
    reward: number
};

const CreateItem = ({ url, data, reward }: InternalProps) => {

    const description = typeof data.description === 'string' ? data.description : 'Undefined';
    const translarot = useTranslations('Tasks');
    //todo text translation
    return (
        <ContainerColor classNameBorder={styles.taskLinkBorder} classNameBackground={styles.taskLinkBackground}>
            <Link className={styles.taskLink} href={url}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Image src={mapTaskIcon(description)}
                           alt={'/'}
                           width={20}
                           height={20}
                           style={{ marginLeft: '1.5vw' }}/>
                    <span className={styles.linkText}>
                        {translarot(`content.others.${'web'}`)}
                    </span>
                </div>
                <ContainerColor
                    classNameBorder={[ styles.rewardValueBorder, 'fit-conteiner' ]}
                    classNameBackground={[ styles.rewardValueBackground, 'text-litle-container' ]}
                >
                    <span className={styles.rewardValue}>{reward} points</span>
                </ContainerColor>
            </Link>
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