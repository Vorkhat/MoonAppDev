import './theme.css'
import styles from './styles.module.scss'
import {Inter} from "next/font/google";
import RatingItem from "@/components/pages/Rating/RatingItem.tsx";

const inter = Inter({subsets: ['latin']})

export default async function Rating() {

    return (
        <div className={styles.rating__page}>
            <header className={`${styles.header__conrainer} ${inter.className}`}>
                <p className={styles.header__title} style={{
                    fontSize: '3.3vh',
                    fontWeight: 'bold'
                }}>ТОП 200 пользователей</p>
                <p className={styles.header__text}> в рейтинге разделят
                    <span className={styles.header__text} style={{
                        color: 'var(--rating-text-color-header-theme)'
                    }}> призовой фонд </span>
                </p>
                <p className={styles.header__text} style={{
                    color: 'var(--rating-text-color-header-theme)'}}>1000$ 🤑</p>
            </header>
            <RatingItem />
        </div>
    )
};