import React from 'react';
import { prisma } from '@/prisma.ts';
import styles from './styles.module.scss';
import ProfileReward from '@/components/pages/Profile/reward/ProfileReward.tsx';
import ProfileFriends from '@/components/pages/Profile/friends/ProfileFriends.tsx';
import { SessionData, useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';
import ContainerColor from '@/common/ContainerColor';

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
        <div className={styles.userProfile}>
            <div className={styles.userItem}>
                <img
                    className={styles.userPhoto}
                    src={`/api/userPhoto/${session.userId}`}
                    alt=""
                    width={160}
                    height={160}
                />
                <div className={styles.userData}>
                    <div className={styles.userName}>
                        {session.firstName} {session.lastName}
                    </div>
                    {session.username ? <h2 className={styles.userTag} style={{ fontWeight: 'normal' }}>@{session.username}</h2> : <></>}
                    <div className={`${styles.userRating} fit-conteiner text-litle-container`}>
                        {t('content.Rank', { rank: user.rank })}
                    </div>
                </div>
            </div>
            <ContainerColor classNameBorder={styles.userBalanceBorder} classNameBackground={styles.userBalanceBackground}>
                <div className={styles.userBalance}>
                    <h2 className={styles.userBalanceValue}>{user.points}</h2>
                    <h2 className={styles.userBalanceCurrency}>points</h2>
                </div>
            </ContainerColor>
            <ProfileReward/>
            <ProfileFriends/>
        </div>
    );
};

export default UserProfile;