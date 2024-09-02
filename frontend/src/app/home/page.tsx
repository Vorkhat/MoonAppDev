import styles from './styles.module.scss';
import {Inter} from "next/font/google";
import ThemeSwitcher from "@/components/Home/Theme/ThemeSwitcher";

const inter = Inter({subsets: ['latin']})

export default  function Home() {

    return (
        <div className={styles.home__page}>
            <header className={styles.header__container}>
                <div className={styles.header__content}>
                    <div className={styles.header__logo}></div>
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
            </header>
            <main className={styles.main__container}>
                <div className={styles.main__content}>
                    <h2>
                        Присоединяйся к нам<br/> зарабатывай баллы и меняй<br/> их на ценные призы! 🎉
                    </h2>
                    <p>
                        Каждый месяц мы подводим итоги и<br/> награждаем самых активных участников<br/> нашего
                        комьюнити🚀
                    </p>
                    <span className="highlight">Призовой фонд - 1000 USDT</span>
                </div>
                <div className={styles.fox__image}></div>
                <div className={styles.invitation__container}>
                    <a className={styles.invitation__telegram} href={'https://www.google.com/?hl=ru'}>
                        <div className={styles.telegram__logo}></div>
                        <div className={`${styles.invitation__text} ${inter.className}`}>Подписаться на канал</div>
                    </a>
                </div>
            </main>
            <footer className={styles.footer__container}>
                <div className={styles.clock__icon}></div>
                <div className={`${styles.footer__text} ${inter.className}`}>До следующего розыгрыша призов:</div>
                <div className={styles.footer__timer}>
                    <div className={styles.timer__number}>
                        <div className={`${styles.number} ${inter.className}`}>1</div>
                        <div className={`${styles.number} ${inter.className}`}>2</div>
                    </div>
                    <div className={`${styles.timer__title} ${inter.className}`}>д.</div>
                    <div className={styles.timer__number}>
                        <div className={`${styles.number} ${inter.className}`}>3</div>
                        <div className={`${styles.number} ${inter.className}`}>4</div>
                    </div>
                    <div className={`${styles.timer__title} ${inter.className}`}>ч.</div>
                    <div className={styles.timer__number}>
                        <div className={`${styles.number} ${inter.className}`}>5</div>
                        <div className={`${styles.number} ${inter.className}`}>6</div>
                    </div>
                    <div className={`${styles.timer__title} ${inter.className}`}>м.</div>
                </div>
            </footer>
        </div>
    )
};