import './theme.css'
import styles from './styles.module.scss'
import {Inter} from "next/font/google";
import CreateQuizComponent from "@/components/Quiz/CreateQuizComponent";

const inter = Inter({subsets: ['latin']})

export default async function Quiz() {

    return (
        <div className={styles.quiz_page}>
            <header className={`${styles.header__conrainer} ${inter.className}`}>
                <p style={{
                    fontSize: '3.6vh',
                    fontWeight: 'bold'
                }}>Доступны новые квизы</p>
                <p className={styles.header__text} style={{
                    marginTop: '1vh'
                }}>Буст для твои поинтов чтобы</p>
                <p className={`${styles.header__text} ${styles.text__color}`} style={{
                    color: 'var(--quiz-text-color-header-theme)'
                }}> попасть в ТОП!</p>
            </header>
            <main className={styles.quiz__list}>
                <CreateQuizComponent />
            </main>
        </div>
    )
};