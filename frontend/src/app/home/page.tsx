import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ThemeSwitcher from '@/components/pages/Home/ThemeSwitcher/ThemeSwitcher';
import { useSession } from '@/components/session';
import Link from 'next/link';

const inter = Inter({ subsets: [ 'latin' ] });


const Timer = ({ number1, number2, title }: { number1: string, number2: string, title: string }) => (
    <>
        <div className={styles.timerNumber}>
            <div className={`${styles.number} ${inter.className}`}>{number1}</div>
            <div className={`${styles.number} ${inter.className}`}>{number2}</div>
        </div>
        <div className={`${styles.timertitle} ${inter.className}`}>{title}</div>
    </>
);


export default async function Home() {
    const session = await useSession();

    return (
        <div className={styles.homePage}>
            <header className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLogo}></div>
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
            </header>
            <main className={styles.mainContainer}>
                <div className={styles.mainContent}>
                    <h2 className={inter.className}>
                        Присоединяйся к нам<br/> зарабатывай баллы и меняй<br/> их на ценные призы! 🎉
                    </h2>
                    <p className={inter.className}>
                        Каждый месяц мы подводим итоги и<br/> награждаем самых активных участников<br/> нашего
                        комьюнити🚀
                    </p>
                    <span className={`highlight ${inter.className}`}>Призовой фонд - 1000 USDT</span>
                </div>
                <div className={styles.foxImage}></div>
                <div className={styles.invitationContainer}>
                    <a className={styles.invitationTelegram} href={'https://www.google.com/?hl=ru'}>
                        <div className={styles.telegramLogo}></div>
                        <div className={`${styles.invitationText} ${inter.className}`}>Подписаться на канал</div>
                    </a>
                </div>
            </main>
            <footer className={styles.footerContainer}>
                <div className={styles.clockIcon}></div>
                <div className={`${styles.footerText} ${inter.className}`}>До следующего розыгрыша призов:</div>
                <div className={styles.footerTimer}>
                    <Timer number1="1" number2="2" title="д."/>
                    <Timer number1="3" number2="4" title="ч."/>
                    <Timer number1="5" number2="6" title="м."/>
                </div>
                {
                    session?.privileged
                    ? <Link href={'/admin'} className={'card'} style={{
                        margin: '8px',
                        color: '#FFFFFF',
                        }}>Админ панель</Link>
                    : <></>
                }
            </footer>
        </div>
    );
};