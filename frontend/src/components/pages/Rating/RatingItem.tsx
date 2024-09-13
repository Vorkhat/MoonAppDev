import './theme.css';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';

const inter = Inter({ subsets: [ 'latin' ] });

const RatingItem = async () => {
    async function refreshLeaderboard() {
        'use server';
    }

    const t = await getTranslations('Rating');

    const users = await prisma.usersTop.findMany({ take: 200 });

    return (
        <div className={`${styles.ratingItem} ${inter.className}`}>
            <div className={styles.ratingHeader}>
                <span className={styles.ratingtext} style={{ fontSize: '0.9em' }}>{t('content')} 20.09.2024</span>
                <form action={refreshLeaderboard}>
                    <button type="submit" style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center',
                        mask: 'url(/images/rating/refresh.svg) no-repeat center',
                        backgroundColor: 'var(--rating-text-color)',
                        width: '25px',
                        height: '25px',
                        padding: '0',
                        margin: '0',
                    }}>
                    </button>
                </form>
            </div>
            <div className={styles.ratingList}>
                {users.map(user => (
                    <div className={styles.userRatingBorder}>
                        <div key={user.id} className={styles.ratingUser}>
                            <div className={styles.userItem}>
                                <img src={`/api/userPhoto/${user.id}`}
                                     className={styles.userProfilePicture}
                                     alt="Avatar" width={43} height={43}
                                     decoding="async"/>
                                <div className={styles.userIndex}>{user.rank}</div>
                                <div style={{
                                    color: 'var(--rating-text-color)',
                                    fontSize: '1.8vh',
                                }}>{user.name}</div>
                            </div>
                            <AwardComponent>{user.points} points</AwardComponent>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingItem;
