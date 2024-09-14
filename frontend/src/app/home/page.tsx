import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ThemeSwitcher from '@/utils/ThemeSwitcher/ThemeSwitcher';
import { useSession } from '@/components/session';
import LanguageSwitcher from '@/utils/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const inter = Inter({ subsets: [ 'latin' ] });

const Timer = ({ number1, number2, title }: { number1: string, number2: string, title: string }) => (
    <>
        <div className={styles.timerNumber}>
            <div className={styles.number}>{number1}</div>
            <div className={styles.number}>{number2}</div>
        </div>
        <div className={styles.timertitle}>{title}</div>
    </>
);

export default async function Home() {

    const session = await useSession();

    const t = await getTranslations('Home');

    return (
        <div className={`${styles.homePage} ${inter.className}`}>
            <div className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <Image className={styles.headerLogo} src={'/images/home/headerImage.png'} alt="logo" height="30"
                           width="30"/>
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
                <LanguageSwitcher userId={session.userId}/>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.mainContent}>
                    <h2>
                        {t('content.title')}
                    </h2>
                    <p>
                        {t('content.content')}
                    </p>
                    <span className={`highlight`}>{t('content.reward')}1000 USDT</span>
                </div>
                <Image className={styles.foxImage} src={'/images/home/fox.png'} alt="fox" height="120" width="137"/>
                <div className={styles.invitationContainer}>
                    <a className={styles.invitationTelegram} href={'https://www.google.com/?hl=ru'}>
                        <Image className={styles.telegramLogo} src={'/images/home/telegramLogo.svg'} alt="telegram logo"
                               height="20" width="20"/>
                        <div className={styles.invitationText}>{t('content.invite')}</div>
                    </a>
                </div>
            </div>
            <footer className={styles.footerContainer}>
                <Image className={styles.clockIcon} src={'/images/home/clock.png'} alt="clock" height="54" width="54"/>
                <div className={styles.footerText}>{t('footer')}</div>
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