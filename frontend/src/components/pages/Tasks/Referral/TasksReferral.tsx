import React from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { TasksIconMapper } from '../tasksIcon.ts';
import { getTranslations } from 'next-intl/server';
import { useSession } from '@/components/session';
import { prisma } from '@/prisma';
import { TrackerType } from '@/trackerType';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';


interface FriendItemProps {
    count_friends: number;
    reward: number;
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

const FriendsItem = ({ count_friends, reward }: FriendItemProps) => (
    <ContainerColor classNameBorder={styles.friendsItemBorder} classNameBackground={styles.friendsItemBackground}>
        <div className={styles.friendsItem}>
            <Image className={styles.friendsImage} src={TasksIconMapper.Friends} width={30} height={30} alt="/"/>
            <div className={`${styles.friendsCount}`}>+ {count_friends}</div>
            <ContainerColor
                classNameBorder={[ styles.rewardValueBorder, 'fit-conteiner' ]}
                classNameBackground={[ styles.rewardValueBackground, 'text-litle-container' ]}
            >
                {reward} баллов
            </ContainerColor>
        </div>
    </ContainerColor>
);

const InvitationsCount = async () => {
    const { _sum: { useCount } } = await getItem();
    const count = useCount ?? 0;

    const translator = await getTranslations('Tasks');
    return (
        <div className={styles.invitationsCount}>
            <div className={styles.invitationsCountText}>{translator('content.friends.count')}</div>
            <ContainerColor classNameBorder={styles.friendsCounterBorder} classNameBackground={styles.friendsCounterBackground}>
                <span className={styles.friendsCount}>{count}</span>
            </ContainerColor>
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
        <ContainerColor classNameBorder={styles.friendsBorder} classNameBackground={styles.friendsBackground}>
            <div className={styles.friendsContainer}>
                <div className={styles.friendsInvitations}>
                    <Image className={styles.friendsImage} src={TasksIconMapper.Friends} alt="/" width={30} height={30}/>
                    <div className={styles.invitationsText}>{t('content.friends.invite')}</div>
                </div>
                <InvitationsCount/>
                <div className={styles.friendsItems}>
                    {tasks.map(item => (
                        <FriendsItem key={item.id}
                                     count_friends={Number((item.tracker.data as JsonObject).useCount)}
                                     reward={item.reward}/>
                    ))}
                </div>
            </div>
        </ContainerColor>
    );
};

export default TasksReferral;
