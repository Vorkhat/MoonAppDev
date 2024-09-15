import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import { getTranslations } from 'next-intl/server';
import { useSession } from '@/components/session';
import { prisma } from '@/prisma';
import { TrackerType } from '@/trackerType';
import { JsonObject } from '@prisma/client/runtime/library';

const inter = Inter({ subsets: [ 'latin' ] });

interface FriendItemProps {
    count_friends: number;
    award: number;
}

export async function getItem() {
    const session = await useSession();

    return prisma.invitation.aggregate({
        _sum: {
            useCount: true,
        },
        where: {
            userId: session.userId,
        },
    });
}

const FriendsItem = ({ count_friends, award }: FriendItemProps) => (
    <div className={styles.itemsBackground}>
        <div className={styles.friendsItem}>
            <Image className={styles.friendsImage} src={TasksIcon.FRIENDS} width={30} height={30} alt="/"/>
            <div className={`${styles.friendsCount}`}>+ {count_friends}</div>
            <div className={`${styles.friendsAward}`}>+ {award} points</div>
        </div>
    </div>
);

const InvitationsCount = async () => {
    const { _sum: { useCount } } = await getItem();
    const count = useCount ?? 0;

    const t = await getTranslations('Tasks');
    return (
        <div className={styles.invitationsCount}>
            <div className={styles.invitationsCountText}>{t('content.friends.count')}</div>
            <div className={styles.invitationsCounterBackground}>
                <div className={styles.invitationsCountCounter}>{count}</div>
            </div>
        </div>
    );
};

const TasksReferral = async () => {
    const t = await getTranslations('Tasks');

    const tasks = await prisma.task.findMany({
        where: {
            AND: [
                {
                    tracker: {
                        data: {
                            path: [ 'type' ],
                            equals: TrackerType.Invite,
                        },
                    },
                },
                {
                    tracker: {
                        data: {
                            path: [ 'useCount' ],
                            gt: 0,
                        },
                    },
                },
            ],
        },
        select: {
            id: true,
            reward: true,
            tracker: {
                select: {
                    data: true,
                },
            },
        },
    });

    return (
        <div className={`${styles.friendsContainer} ${inter.className}`}>
            <div className={styles.backgroundContainer}>
                <div className={styles.friendsInvitations}>
                    <Image className={styles.friendsImage} src={TasksIcon.FRIENDS} alt="/" width={30} height={30}/>
                    <div className={styles.invitationsText}>{t('content.friends.invite')}</div>
                </div>
                <InvitationsCount/>
                <div className={styles.friendsItems}>
                    {tasks.map(item => (
                        <FriendsItem key={item.id} count_friends={Number((item.tracker.data as JsonObject).useCount)}
                                     award={item.reward}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksReferral;
