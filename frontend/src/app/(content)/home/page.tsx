import './theme.scss'
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ThemeSwitcher from '@/utils/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from '@/utils/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { prisma } from '@/prisma';
import { DateTime, Settings } from 'luxon';
import { unstable_cache } from 'next/cache';
import ContainerColor from '@/common/ContainerColor';

const inter = Inter({ subsets: [ 'latin' ] });

export const dynamic = 'force-dynamic';

const getTime = unstable_cache(async () => {
        const timer = await prisma.topSnapshot.findFirst({
            where: {
                completed: false,
            },
            orderBy: {
                takenAt: 'desc',
            },
            select: {
                takenAt: true,
            },
        });

        Settings.defaultZone = 'UTC';

        return timer && (DateTime.fromJSDate(timer.takenAt).diffNow([ 'days', 'hours', 'minutes' ]).toObject());
    },
    [ 'timer' ],
    { revalidate: 60, tags: [ 'timer' ] });

const Timer = ({ value, title }: { value: string, title: string }) => (
    <>
        <div className={styles.timerNumber}>
            {
                [ ...value ].map((char, i) => (
                    <div key={i} className={styles.number}>{char}</div>
                ))
            }
        </div>
        <div className={styles.timertitle}>{title}</div>
    </>
);

export default async function Home() {
    const time = await getTime();
    const t = await getTranslations('Home');

    return (
        <div className={`${styles.homePage} ${inter.className}`}>
            <div className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <Image className={styles.headerLogo} src={'/images/home/headerImage.png'} alt="logo" height="30" width="30"/>
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
                <LanguageSwitcher/>
            </div>
            <ContainerColor classNameBorder={styles.mainContainerBorder} classNameBackground={styles.mainContainerBackground}>
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
                <ContainerColor classNameBorder={styles.invitationContainerBorder} classNameBackground={styles.invitationContainerBackground}>
                    <a className={styles.invitationTelegram} href={'https://www.google.com/?hl=ru'}>
                        <Image className={styles.telegramLogo} src={'/images/home/telegramLogo.svg'} alt="telegram logo" height="20" width="20"/>
                        <div className={styles.invitationText}>{t('content.invite')}</div>
                    </a>
                </ContainerColor>
            </ContainerColor>
            {
                time && (
                    <footer className={styles.footerContainer}>
                        <Image className={styles.clockIcon} src={'/images/home/clock.png'} alt="clock" height="54" width="54"/>
                        <div className={styles.footerText}>{t('footer')}</div>
                        <div className={styles.footerTimer}>
                            {time.days ? <Timer value={Math.floor(time.days).toString()} title="д."/> : null}
                            {time.hours ? <Timer value={Math.floor(time.hours).toString()} title="ч."/> : null}
                            {time.minutes ? <Timer value={Math.floor(time.minutes).toString()} title="м."/> : null}
                        </div>
                    </footer>
                )
            }
        </div>
    );
};