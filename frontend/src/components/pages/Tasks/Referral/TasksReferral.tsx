import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

type FriendAward = {
    count_friends: number;
    award: number;
};

const data: FriendAward[] = [
    { count_friends: 1, award: 155 },
    { count_friends: 5, award: 300 },
    { count_friends: 20, award: 500 },
    { count_friends: 30, award: 1000 },
    { count_friends: 40, award: 2000 },
    { count_friends: 50, award: 3000 },
];

interface FriendItemProps {
    count_friends: number;
    award: number;
}

const FriendsItem = ({ count_friends, award }: FriendItemProps) => (
    <div className={styles.itemsBackground}>
        <div className={styles.friendsItem}>
            <Image className={styles.friendsImage} src={TasksIcon.FRIENDS} width={30} height={30} alt="/" />
            <div className={`${styles.friendsCount}`}>+ {count_friends}</div>
            <div className={`${styles.friendsAward}`}>+ {award} points</div>
        </div>
    </div>
);

const InvitationsCount = async () => {
    const t = await getTranslations('Tasks');

    return (
        <div className={styles.invitationsCount}>
            <div className={styles.invitationsCountText}>{t('content.friends.count')}</div>
            <div className={styles.invitationsCounterBackground}>
                <div className={styles.invitationsCountCounter}>7</div>
            </div>
        </div>
    );
};

const TasksReferral = async () => {
    const t = await getTranslations('Tasks');

    return (
        <div className={`${styles.friendsContainer} ${inter.className}`}>
            <div className={styles.backgroundContainer}>
                <div className={styles.friendsInvitations}>
                    <Image className={styles.friendsImage} src={TasksIcon.FRIENDS} alt="/" width={30} height={30} />
                    <div className={styles.invitationsText}>{t('content.friends.invite')}</div>
                </div>
                <InvitationsCount />
                <div className={styles.friendsItems}>
                    {data.map((item, index) => (
                        <FriendsItem key={index} count_friends={item.count_friends} award={item.award} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksReferral;
