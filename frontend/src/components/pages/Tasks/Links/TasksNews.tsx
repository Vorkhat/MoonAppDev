import './theme.css'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "../tasksIcon.ts";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    award: number;
    link: string;
    icon: string;
}

const CreateItem = ({award, link, icon}: ItemProps) => {
    return (
        <Link className={`${styles.taskLink} ${inter.className}`} href={link}>
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <Image src={icon} alt={'/'} width={20} height={20} style={{
                    marginLeft: "1.5vw"
                }}/>
                <text className={styles.linkText}>Перейти на сайт</text>
            </div>
            <text className={styles.linkAward}>+ {award} points</text>
        </Link>
    )
}

const TasksLinks = () => {
    return (
        <div className={styles.taskListLink}>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.WEB}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.INSTAGRAM}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.DOWNLAND}/>
        </div>
    )
}

export default TasksLinks;