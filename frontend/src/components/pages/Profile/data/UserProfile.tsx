import './theme.css';
import React from 'react';
import { prisma } from '@/prisma.ts';
import styles from './styles.module.scss';
import ProfileAward from '@/components/pages/Profile/award/ProfileAward.tsx';
import ProfileFriends from '@/components/pages/Profile/friends/ProfileFriends.tsx';
import { Inter, Montserrat } from 'next/font/google';
import { SessionData, useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';

const montserrat = Montserrat({ subsets: [ 'latin' ] });
const inter = Inter({ subsets: [ 'latin' ] });

export async function getUser(id: number) {
    return prisma.usersTop.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
}

const UserProfile = async () => {
    const session: SessionData = await useSession();

    const user = await getUser(session.userId);

    const t = await getTranslations('Profile');

    return (
        <div className={styles.user__profile}>
            <div className={styles.user__item}>
                <img
                    className={styles.user__photo}
                    src={`/api/userPhoto/${session.userId}`}
                    alt=""
                    width={160}
                    height={160}
                />
                <div className={styles.user__data}>
                    <div
                        className={`${styles.user__name} ${inter.className}`}>{session.firstName} {session.lastName}</div>
                    {session.username ? <div
                        className={`${styles.user__tag} ${inter.className}`}>@{session.username}</div> : <></>}
                    <div className={`${styles.user__rating} ${inter.className}`}>{
                        t('content.Rank', { rank: user.rank })
                    }</div>
                </div>
            </div>
            <div className={styles.user__balance_border}>
                <div className={`${styles.user__balance} ${montserrat.className}`}>
                    <div className={styles.user__balance_value}>{user.points}</div>
                    <div className={styles.user__balance_currency}>points</div>
                </div>
            </div>
            <ProfileAward/>
            <ProfileFriends/>
        </div>
    );
};

export default UserProfile;