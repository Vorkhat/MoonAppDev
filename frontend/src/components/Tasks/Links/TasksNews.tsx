import './theme.css'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "@/components/Tasks/tasksIcon.ts";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    award: number;
    link: string;
    icon: string;
}

const CreateItem = ({award, link, icon}: ItemProps) => {
    return (
        <Link className={`${styles.task__link} ${inter.className}`} href={link}>
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <Image src={icon} alt={'/'} width={20} height={20} style={{
                    marginLeft: "1.5vw"
                }}/>
                <text className={styles.link__text}>Перейти на сайт</text>
            </div>
            <text className={styles.link__award}>+ {award} points</text>
        </Link>
    )
}

const TasksLinks = () => {
    return (
        <div className={styles.task__list_link}>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.WEB}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.INSTAGRAM}/>
            <CreateItem award={155} link={'https://google.com'} icon={TasksIcon.DOWNLAND}/>
        </div>
    )
}

export default TasksLinks;