import './theme.css'
import styles from './styles.module.scss'
import Image from "next/image";
import React from "react";
import phoneImage from '../../../../public/images/tasks/phone.svg'
import repostImage from '../../../../public/images/tasks/repost.svg'
import {Inter, Montserrat, Roboto} from "next/font/google";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    images: string,
    text: string,
    award: number,
    currency: string
}

function CreateItem({images, text, award, currency}: ItemProps) {
    return (
        <div className={styles.task__gradient}>
            <div className={styles.task__item}>
                <Image className={styles.task__image} src={images} alt={'/'}/>
                <div className={`${styles.task__text} ${inter.className}`}>{text}</div>
                <div className={`${styles.task__award} ${inter.className}`}>+{award} {currency}</div>
           </div>
        </div>
    )
}

const TasksNews = () => {
    return (
        <div className={styles.tasks__items}>
            <CreateItem text={'Выложить сторис'} images={phoneImage} award={100} currency={'poinst'}/>
            <CreateItem text={'Отдать голос'} images={repostImage} award={100} currency={'points'}/>
        </div>
    )
}

export default TasksNews;