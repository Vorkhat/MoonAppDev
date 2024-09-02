'use client'

import './theme.css'
import styles from './styles.module.scss'
import React from "react";
import {Inter} from "next/font/google";
import Image from "next/image";
import friendsImage from "../../../../public/images/tasks/friends.svg";

const inter = Inter({subsets: ['latin']})

type FriendAward = {
    count_friends: number;
    award: number;
    currency: string
};

const data: FriendAward[] = [
    {count_friends: 1, award: 155, currency: 'points'},
    {count_friends: 5, award: 300, currency: 'points'},
    {count_friends: 20, award: 500, currency: 'points'},
    {count_friends: 30, award: 1000, currency: 'points'},
    {count_friends: 40, award: 2000, currency: 'points'},
    {count_friends: 50, award: 3000, currency: 'points'},
];


const TasksDaily = () => {

    return (
        <div className={styles.friends__container}>
            <div className={styles.background__container}>
                <div className={styles.friends__invitations}>
                    <Image className={styles.friends__image} src={friendsImage} alt={'/'}/>
                    <div className={`${styles.invitations__text} ${inter.className}`}>Пригласить друзей</div>
                </div>
                <div className={styles.invitations__count}>
                    <div className={`${styles.invitations__count_text} ${inter.className}`}>Всего приглашено</div>
                    <div className={`${styles.invitations__count_counter} ${inter.className}`}>7</div>
                </div>
                <div className={styles.friends__items}>
                    {data.map((item) => (
                        <div className={styles.items__background}>
                            <div className={styles.friends__item}>
                                <Image className={styles.friends__image} src={friendsImage} alt={'/'}/>
                                <div className={`${styles.friends__count} ${inter.className}`}>+ {item.count_friends}</div>
                                <div className={`${styles.friends__award} ${inter.className}`}>+ {item.award} {item.currency}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TasksDaily;