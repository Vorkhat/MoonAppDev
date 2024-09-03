import './theme.css'
import React from "react";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss'
import {TasksIcon} from "@/components/Tasks/tasksIcon.ts";

const inter = Inter({subsets: ['latin']})

type FriendAward = {
    count_friends: number;
    award: number;
};

const data: FriendAward[] = [
    {count_friends: 1, award: 155},
    {count_friends: 5, award: 300},
    {count_friends: 20, award: 500},
    {count_friends: 30, award: 1000},
    {count_friends: 40, award: 2000},
    {count_friends: 50, award: 3000},
];

interface FriendItemProps {
    count_friends: number;
    award: number;
}

const FriendsItem = ({ count_friends, award }: FriendItemProps) => (
    <div className={styles.items__background}>
        <div className={styles.friends__item}>
            <Image className={styles.friends__image} src={TasksIcon.FRIENDS} width={30} height={30} alt="/" />
            <div className={`${styles.friends__count} ${inter.className}`}>+ {count_friends}</div>
            <div className={`${styles.friends__award} ${inter.className}`}>+ {award} {process.env.CURRENCY}</div>
        </div>
    </div>
);

const InvitationsCount = () => (
    <div className={styles.invitations__count}>
        <div className={`${styles.invitations__count_text} ${inter.className}`}>Всего приглашено</div>
        <div className={styles.invitations__counter_background}>
            <div className={`${styles.invitations__count_counter} ${inter.className}`}>7</div>
        </div>
    </div>
);

const TasksReferral = () => {
    return (
        <div className={styles.friends__container}>
            <div className={styles.background__container}>
                <div className={styles.friends__invitations}>
                    <Image className={styles.friends__image} src={TasksIcon.FRIENDS} alt="/" width={30} height={30} />
                    <div className={`${styles.invitations__text} ${inter.className}`}>
                        Пригласить друзей
                    </div>
                </div>
                <InvitationsCount />
                <div className={styles.friends__items}>
                    {data.map((item, index) => (
                        <FriendsItem
                            key={index}
                            count_friends={item.count_friends}
                            award={item.award}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksReferral;