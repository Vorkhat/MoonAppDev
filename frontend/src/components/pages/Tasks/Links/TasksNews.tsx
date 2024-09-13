import './theme.css'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "../tasksIcon.ts";
import { useTranslations } from 'next-intl';

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    award: number;
    link: string;
    icon: string;
    text: string;
}

const CreateItem = ({award, link, icon, text}: ItemProps) => {
    const t = useTranslations('Tasks');

    return (
        <div style={{
            padding: "1px",
            background: "linear-gradient(90deg, #86F1AD 0%, #8DBEFD 30%, #E0AAEE 100%)",
            borderRadius: "3vw",
        }}>
            <Link className={`${styles.taskLink} ${inter.className}`} href={link}>
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Image src={icon} alt={'/'} width={20} height={20} style={{
                        marginLeft: "1.5vw"
                    }}/>
                    <span className={styles.linkText}>{t(`content.others.${text}`)}</span>
                </div>
                <span className={styles.linkAward}>+ {award} points</span>
            </Link>
        </div>
    )
}

const TasksLinks = () => {
    return (
        <div className={styles.taskListLink}>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.WEB} text={'web'}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.INSTAGRAM} text={'web'}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.DOWNLAND} text={'web'}/>
        </div>
    )
}

export default TasksLinks;