import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ThemeSwitcher from '@/utils/ThemeSwitcher/ThemeSwitcher';
import { useSession } from '@/components/session';
import LanguageSwitcher from '@/utils/LanguageSwitcher';
import {getTranslations} from 'next-intl/server';
import { cookies } from 'next/headers';

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

    const t = await getTranslations('Home');

    return (
        <div className={styles.homePage}>
            <header className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLogo}></div>
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
                <LanguageSwitcher userId={session.userId}/>
            </header>
            <main className={styles.mainContainer}>
                <div className={styles.mainContent}>
                    <h2 className={inter.className}>
                        {t('content.title')}
                    </h2>
                    <p className={inter.className}>
                        {t('content.content')}
                    </p>
                    <span className={`highlight ${inter.className}`}>Призовой фонд - 1000 USDT</span>
                </div>
                <div className={styles.foxImage}></div>
                <div className={styles.invitationContainer}>
                    <a className={styles.invitationTelegram} href={'https://www.google.com/?hl=ru'}>
                        <div className={styles.telegramLogo}></div>
                        <div className={`${styles.invitationText} ${inter.className}`}>{t('content.invite')}</div>
                    </a>
                </div>
            </main>
            <footer className={styles.footerContainer}>
                <div className={styles.clockIcon}></div>
                <div className={`${styles.footerText} ${inter.className}`}>{t('footer')}</div>
                <div className={styles.footerTimer}>
                    <Timer number1="1" number2="2" title="д."/>
                    <Timer number1="3" number2="4" title="ч."/>
                    <Timer number1="5" number2="6" title="м."/>
                </div>
                {
                    /*session?.privileged
                    ? <Link href={'/admin'} className={'card'}>Админ панель</Link>
                    : <></>*/
                }
            </footer>
        </div>
    );
};