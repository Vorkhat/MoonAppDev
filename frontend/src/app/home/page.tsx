import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ThemeSwitcher from '@/components/Home/Theme/ThemeSwitcher';
import { useSession } from '@/components/session';
import Link from 'next/link';

const inter = Inter({ subsets: [ 'latin' ] });


const Timer = ({ number1, number2, title }: { number1: string, number2: string, title: string }) => (
    <>
        <div className={styles.timer__number}>
            <div className={`${styles.number} ${inter.className}`}>{number1}</div>
            <div className={`${styles.number} ${inter.className}`}>{number2}</div>
        </div>
        <div className={`${styles.timer__title} ${inter.className}`}>{title}</div>
    </>
);


export default async function Home() {
    const session = await useSession();

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
                    <h2 className={inter.className}>
                        Присоединяйся к нам<br/> зарабатывай баллы и меняй<br/> их на ценные призы! 🎉
                    </h2>
                    <p className={inter.className}>
                        Каждый месяц мы подводим итоги и<br/> награждаем самых активных участников<br/> нашего
                        комьюнити🚀
                    </p>
                    <span className={`highlight ${inter.className}`}>Призовой фонд - 1000 USDT</span>
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
                    <Timer number1="1" number2="2" title="д."/>
                    <Timer number1="3" number2="4" title="ч."/>
                    <Timer number1="5" number2="6" title="м."/>
                </div>
                {
                    session?.privileged
                    ? <Link href={'/admin'} className={'card'} style={{ margin: '8px' }}>Админ панель</Link>
                    : <></>
                }
            </footer>
        </div>
    );
};