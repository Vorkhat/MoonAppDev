import React from 'react';
import { prisma } from '@/prisma.ts';
import styles from './styles.module.scss';
import ProfileReward from '@/components/pages/Profile/reward/ProfileReward.tsx';
import ProfileFriends from '@/components/pages/Profile/friends/ProfileFriends.tsx';
import { SessionData, useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: [ 'latin' ] });

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

    const translator = await getTranslations('Profile');

    return (
        <div className={styles.userItem}>
            <div className={styles.userData}>
                <img
                    className={styles.userPhoto}
                    src={`/api/userPhoto/${session.userId}`}
                    alt=""
                    width={160}
                    height={160}
                />
                <div className={styles.userContacts}>
                    <h4>
                        {session.firstName} {session.lastName}
                    </h4>
                    {session.username ?
                     <h2 className={styles.userTag}>
                         @{session.username}
                     </h2> : <></>}
                    <p className={`${styles.userRank} fit-content`}>
                        {translator('content.Rank', { rank: user.rank })}
                    </p>
                </div>
                <div className={`${styles.userBalance} ${styles.userBalanceBorder} gradient-border`}>
                    <h5 className={styles.userBalanceValue}>{user.points}</h5>
                    <h3 className={`${styles.userBalanceCurrency} ${montserrat.className}`}>points</h3>
                </div>
            </div>
            <ProfileReward/>
            <ProfileFriends/>
        </div>
    );
};

export default UserProfile;