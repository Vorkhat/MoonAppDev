import './theme.css'
import styles from './styles.module.scss'
import {Inter} from "next/font/google";
import RatingItem from "@/components/pages/Rating/RatingItem.tsx";

const inter = Inter({subsets: ['latin']})

export default async function Rating() {

    return (
        <div className={styles.ratingPage}>
            <header className={`${styles.headerConrainer} ${inter.className}`}>
                <p className={styles.headerTitle} style={{
                    fontSize: '3.3vh',
                    fontWeight: 'bold'
                }}>ТОП 200 пользователей</p>
                <p className={styles.headerText}> в рейтинге разделят
                    <span className={styles.headerText} style={{
                        color: 'var(--rating-text-color-header-theme)'
                    }}> призовой фонд </span>
                </p>
                <p className={styles.headerText} style={{
                    color: 'var(--rating-text-color-header-theme)'}}>1000$ 🤑</p>
            </header>
            <RatingItem />
        </div>
    )
};