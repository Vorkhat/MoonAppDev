import './theme.css'
import React from "react";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "@/components/Tasks/tasksIcon.ts";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    images: string,
    text: string,
    award: number,
}

function CreateItem({images, text, award}: ItemProps) {
    return (
        <div className={styles.task__gradient}>
            <div className={styles.task__item}>
                <Image className={styles.task__image} src={images} width={44} height={44} alt={'/'}/>
                <div className={`${styles.task__text} ${inter.className}`}>{text}</div>
                <div className={`${styles.task__award} ${inter.className}`}>+{award} points</div>
            </div>
        </div>
    )
}

const TasksNews = () => {
    return (
        <div className={styles.tasks__items}>
            <CreateItem text={'Выложить сторис'} images={TasksIcon.PHONE} award={100}/>
            <CreateItem text={'Отдать голос'} images={TasksIcon.REPOST} award={100}/>
        </div>
    )
}

export default TasksNews;