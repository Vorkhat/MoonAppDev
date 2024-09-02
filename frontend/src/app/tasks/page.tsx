import './theme.css'
import styles from './styles.module.scss';
import {Inter, Montserrat, Roboto} from "next/font/google";
import TasksNews from "@/components/Tasks/News/TasksNews.tsx";
import TasksDaily from "@/components/Tasks/Daily/TasksDaily.tsx";
import PartnersTasks from "@/components/Tasks/Partners/PartnersTasks.tsx";

const montserrat = Montserrat({subsets: ['latin'],})
const roboto = Roboto({weight: '400', subsets: ['latin']})
const inter = Inter({subsets: ['latin']})

export default  function Tasks() {

    return (
        <div className={styles.tasks__page}>
            <header className={styles.header__container}>
                <div className={styles.header__text}>
                    <p className={`${styles.text_normal} ${inter.className}`}>Выполняй задания и </p>
                    <p className={`${styles.text_normal} ${inter.className}`}>получай
                        <span className={`${styles.text__color} ${inter.className}`}> баллы!</span></p>
                </div>
            </header>
            <main className={styles.main__container}>
                <div className={styles.tasks__news}>
                    <div className={`${styles.news__header} ${inter.className}`}>New 🔥</div>
                    <TasksNews/>
                </div>
                <div className={styles.tasks__daily}>
                    <div className={`${styles.daily__header} ${inter.className}`}>Ежедневные 🎯</div>
                    <TasksDaily/>
                </div>
                <div className={styles.partners}>
                    <div className={`${styles.partners__header} ${inter.className}`}>Наши партнеры 💼</div>
                    <PartnersTasks />
                </div>

            </main>
        </div>
    )
};