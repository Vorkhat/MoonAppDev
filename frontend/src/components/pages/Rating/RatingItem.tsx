import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import ContainerColor from '@/common/ContainerColor';

const RatingItem = async () => {
    async function refreshLeaderboard() {
        'use server';
    }

    const translator = await getTranslations('Rating');

    const users = await prisma.usersTop.findMany({ take: 200 });

    return (
        <div className={styles.ratingItem}>
            <div className={styles.ratingHeader}>
                <span className={styles.ratingtext}
                      style={{ fontSize: '0.9em' }}>
                    {translator('content')} 20.09.2024
                </span>
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
                    <ContainerColor key={user.id} classNameBorder={[styles.containerBorder]} classNameBackground={styles.containerBackground}>
                        <div className={styles.ratingUser}>
                            <div className={styles.userItem}>
                                <img src={`/api/userPhoto/${user.id}`}
                                     className={styles.userProfilePicture}
                                     alt="Avatar" width={43} height={43}
                                     decoding="async"/>
                                <div className="friends-counter">{user.rank}</div>
                                <div style={{
                                    color: 'var(--text-color)',
                                    fontSize: '1.8vh',
                                }}>
                                    {user.name}
                                </div>
                            </div>
                            <ContainerColor classNameBorder={[styles.rewardValueBorder, "fit-conteiner"]}
                                            classNameBackground={[styles.rewardValueBackground, "text-litle-container"]}
                            >
                                {user.points} points
                            </ContainerColor>
                        </div>
                    </ContainerColor>
                ))}
            </div>
        </div>
    );
};

export default RatingItem;
