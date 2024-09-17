import './common.scss';
import styles from './styles.module.scss';
import ThemeSwitcher from '@/utils/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from '@/utils/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { prisma } from '@/prisma';
import { DateTime, Settings } from 'luxon';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
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
        <div className={styles.timerData}>
            {
                [ ...value ].map((char, i) => (
                    <h2 key={i} className={`${styles.data} ${styles.dataBorder} gradient-border`}>{char}</h2>
                ))
            }
        </div>
        <h2 className={styles.timerTitle}>{title}</h2>
    </>
);

export default async function Home() {
    const time = await getTime();
    const translator = await getTranslations('Home');

    return (
        <div className={styles.homePageContainer}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Image className={styles.logo}
                           src={'/images/home/headerImage.png'}
                           alt="logo"
                           height="30"
                           width="30"
                           priority={true}
                    />
                    <h1>MOON APP</h1>
                </div>
                <ThemeSwitcher/>
                <LanguageSwitcher/>
            </header>
            <main className={styles.main}>
                <div className={styles.mainContent}>
                    <h2>
                        {translator('content.title')}
                    </h2>
                    <p>
                        {translator('content.content')}
                    </p>
                    <h2 className='highlight-text'>
                        {translator('content.reward')} 1000 USDT
                    </h2>
                </div>
                <Image className={styles.foxImage}
                       src={'/images/home/fox.png'}
                       alt="fox"
                       height="120"
                       width="137"
                       priority={true}
                />
                <a className={`${styles.invitationTelegram} ${styles.invitationTelegramBorder} gradient-border`}
                   href={process.env.BOT_URL}>
                    <Image className={styles.telegramLogo}
                           src={'/images/home/telegramLogo.svg'}
                           alt="telegram logo"
                           height="20" width="20"
                    />
                    <h3 className={styles.invitationTelegramText}>
                        {translator('content.invite')}
                    </h3>
                </a>
            </main>
            {
                time && (
                    <footer className={styles.footer}>
                        <Image className={styles.clockIcon}
                               src={'/images/home/clock.png'}
                               alt="clock"
                               height="54"
                               width="54"
                               priority={true}
                        />
                        <h3 className={styles.footerText}>
                            {translator('footer.text')}
                        </h3>
                        <div className={styles.footerTimer}>
                            {time.days ? <Timer value={Math.floor(time.days).toString()} title={translator('footer.timer.days')}/> : null}
                            {time.hours ? <Timer value={Math.floor(time.hours).toString()} title={translator('footer.timer.hours')}/> : null}
                            {time.minutes ? <Timer value={Math.floor(time.minutes).toString()} title={translator('footer.timer.minutes')}/> : null}
                        </div>
                    </footer>
                )
            }
        </div>
    );
}