'use client';

import './theme.css';
import Image from 'next/image';
import {Inter} from 'next/font/google';
import styles from './styles.module.scss';
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';
import { useTranslations } from 'next-intl';

const inter = Inter({subsets: ['latin']});

const RatingItem = () => {

    const t = useTranslations('Rating');
    const userTemplate = {
        name: 'Евгений Дорофеев',
        avatar: '/images/avatar.png',
        points: 1000
    };

    const users = Array.from({length: 200}, (_, index) => ({
        ...userTemplate,
        name: `${userTemplate.name}`,  // Уникальное имя
        avatar: `${userTemplate.avatar}${index + 1}`, // Уникальный аватар (меняется по индексу)
        points: userTemplate.points * (index + 1)    // Очки умножены на индекс
    }));

    return (
        <div className={`${styles.ratingItem} ${inter.className}`}>
            <div className={styles.ratingHeader}>
                <span className={styles.ratingtext} style={{fontSize: "0.9em"}}>{t('content')} 20.09.2024</span>
                <button style={{
                    background: "none",
                    border: "none",
                }}>
                    <Image src={'images/rating/update.svg'} width={22} height={22} alt={''} style={{
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}/>
                </button>
            </div>
            <div className={styles.ratingList}>
                {users.map((user, index) => (
                    <div className={styles.userRatingBorder}>
                        <div key={index} className={styles.ratingUser}>
                            <div className={styles.userItem}>
                                <Image src={'/images/avatar.png'} alt="Avatar" width={43} height={43}/>
                                <div className={styles.userIndex}>{index}</div>
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
