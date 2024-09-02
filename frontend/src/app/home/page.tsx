import './theme.css'
import styles from './styles.module.scss';
import {Inter, Montserrat, Roboto} from "next/font/google";
import ThemeSwitcher from "@/components/Home/Theme/ThemeSwitcher";

const montserrat = Montserrat({subsets: ['latin'],})
const roboto = Roboto({weight: '400', subsets: ['latin']})
const inter = Inter({subsets: ['latin']})

export default  function Home() {

    return (
        <div className={styles.home__page}>
            <header className={styles.header__container}>
                <div className={styles.header__content}>
                    <div className={styles.header__logo}></div>
                    <div className={`${styles.header__text} ${montserrat.className}}`}>MOON APP</div>
                </div>
                <ThemeSwitcher/>
            </header>
            <main className={styles.main__container}>
                <div className={styles.main__content}>
                    <div className={`${styles.content__header} ${roboto.className}`}>
                        Присоединяйся к нам<br/> зарабатывай баллы и меняй<br/> их на ценные призы! 🎉
                    </div>
                    <div className={`${styles.content__main} ${inter.className}`}>
                        Каждый месяц мы подводим итоги и<br/> награждаем самых активных участников<br/> нашего
                        комьюнити🚀
                    </div>
                    <div className={`${styles.content__footer} ${inter.className}`}>
                        Призовой фонд - 1000 USDT
                    </div>
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