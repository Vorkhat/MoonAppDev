'use client';

import './theme.css';
import Image from 'next/image';
import {Inter} from 'next/font/google';
import styles from './styles.module.scss';

const inter = Inter({subsets: ['latin']});

const RatingItem = () => {

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
        <div className={styles.rating__item}>
            <div className={styles.rating__header}>
                <span className={`${styles.rating__text} ${inter.className}`}>Итоговый снепшот - 20.09.2024</span>
                <button>
                    <Image src={'images/rating/update.svg'} width={22} height={22} alt={''} style={{
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}/>
                </button>
            </div>
            <div id={'rating__list'} className={styles.rating__list}>
                {users.map((user, index) => (
                    <div className={styles.user_rating_border}>
                        <div key={index} className={`${styles.rating__user} ${inter.className}`}>
                            <div className={styles.user__item}>
                                <Image src={'/images/avatar.png'} alt="Avatar" width={43} height={43}/>
                                <div style={{
                                    margin: '0 2vw',
                                    padding: '0.8vh 3vw',
                                    background: '#5E6065',
                                    borderRadius: '2vw',
                                }}>{index}</div>
                                <div style={{
                                    color: 'var(--rating-text-color)',
                                    fontSize: '1.8vh',
                                }}>{user.name}</div>
                            </div>
                            <div className={styles.user__award}> {user.points} points</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingItem;
