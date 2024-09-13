import './theme.css'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "../tasksIcon.ts";
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';
import { Task } from '@prisma/client';

const inter = Inter({subsets: ['latin']})

export function mapTaskIcon(task: string) {
    return TasksIcon.WEB; // todo task icons mapping
}

type InternalProps = {
    url: string;
    data: JsonObject;
    reward: number
};

const CreateItem = ({url, data, reward}: InternalProps) => {

    const description = typeof data.description === 'string' ? data.description : 'Undefined';
    const t = useTranslations('Tasks');
    //todo text translation
    return (
        <div style={{
            padding: "1px",
            background: "linear-gradient(90deg, #86F1AD 0%, #8DBEFD 30%, #E0AAEE 100%)",
            borderRadius: "3vw",
        }}>
            <Link className={`${styles.taskLink} ${inter.className}`} href={url}>
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Image src={mapTaskIcon(description)} alt={'/'} width={20} height={20} style={{
                        marginLeft: "1.5vw"
                    }}/>
                    <span className={styles.linkText}>{t(`content.others.${'web'}`)}</span>
                </div>
                <span className={styles.linkAward}>+ {reward} points</span>
            </Link>
        </div>
    )
}

const TasksLinks = ({ data }: { data: InternalProps[] }) => {
    return (
        <div className={styles.taskListLink}>
            {data.map((item, index) => (
                <CreateItem key={index} {...item} />
            ))}
        </div>
    )
}

export default TasksLinks;