import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import refrehIcon from '@/app/(content)/rating/images/refresh.svg';

const RatingItem = async () => {
    async function refreshLeaderboard() {
        'use server';
    }

    const topSnapshot = await prisma.topSnapshot.findFirst({
        orderBy: {
            takenAt: 'desc',
        },
        select: {
            takenAt: true,
        },
    });

    const topSnapshotDate = topSnapshot?.takenAt
                            ? topSnapshot.takenAt.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
        }).replace(/\//g, '.')
                            : '00.00';

    const translator = await getTranslations('Rating');

    const users = await prisma.usersTop.findMany({
        take: 200,
        orderBy: {
            rank: 'asc',
        },
    });

    return (
        <div className={styles.ratingItem}>
            <div className={styles.ratingHeader}>
                <span className={styles.ratingtext}
                      style={{ fontSize: '0.9em' }}>
                    {translator('content')} {topSnapshotDate}
                </span>
                <form action={refreshLeaderboard}>
                    <button type="submit" style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center',
                        mask: `url(${refrehIcon.src}) no-repeat center`,
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
                    <div key={user.id} className={`${styles.ratingUser} ${styles.ratingUserBorder} gradient-border`}>
                        <div className={styles.userItem}>
                            <img src={`/api/userPhoto/${user.id}`}
                                 className={styles.userProfilePicture}
                                 alt="Avatar" width={43} height={43}
                                 decoding="async"/>
                            <h3 className="friends-counter">{user.rank}</h3>
                            <h3>{user.name}</h3>
                        </div>
                        <h6 className={styles.reward}>{user.points} баллов</h6>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingItem;
