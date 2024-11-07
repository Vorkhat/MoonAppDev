import './common.scss';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { prisma } from '@/prisma';
import { DateTime, Settings } from 'luxon';
import { unstable_cache } from 'next/cache';
import localFont from 'next/font/local';
import telegramLogo from '@/app/(content)/home/images/telegramLogo.svg';
import foxIcon from '@/app/(content)/home/images/fox.png';
import headerIcon from '@/app/(content)/home/images/headerImage.png';
import clockIcon from '@/app/(content)/home/images/clock.png';
import OpenInTelegramButton from '@/components/input/openInTelegramButton.tsx';

const logoFont = localFont({ src: './LogoRegular.ttf' });

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
        <div className={`${styles.homePageContainer} mt-4`}>
            <header className={styles.header}>
                {/*
                <ThemeSwitcher/>
                */}
                <div className={styles.headerMain}>
                    <div className={styles.headerContent}>
                        <div>
                            <Image src={headerIcon}
                                   style={{
                                       position: 'absolute',
                                       transform: 'translateY(-40px)'
                                    }}
                                   alt="logo"
                                   height="200"
                                   width="200"
                                   priority
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainContent}>
                    <strong>
                        <p style={{ fontSize: '13px' }}
                           dangerouslySetInnerHTML={{ __html: translator('content.content').replace(/\n/g, '<br />') }}>
                        </p>
                    </strong>
                    <h2 className="highlight-text text-nowrap">
                        Подписка на канал 50 баллов
                    </h2>
                </div>
                <Image className={styles.foxImage}
                       src={foxIcon}
                       alt="fox"
                       height="120"
                       width="137"
                       priority={true}
                />
                <OpenInTelegramButton
                    className={`${styles.invitationTelegram} ${styles.invitationTelegramBorder} gradient-border`}
                    href={process.env.BOT_URL}>
                    <Image className={styles.telegramLogo}
                           src={telegramLogo}
                           alt="telegram logo"
                           height="20" width="20"
                    />
                    <h3 className={styles.invitationTelegramText}>
                        {translator('content.invite')}
                    </h3>
                </OpenInTelegramButton>
            </main>
            {
                time && (
                    <footer className={styles.footer}>
                        <Image className={styles.clockIcon}
                               src={clockIcon}
                               alt="clock"
                               height="54"
                               width="54"
                               priority={true}
                        />
                        <h3 className={styles.footerText}>
                            {translator('footer.text')}
                        </h3>
                        <div className={styles.footerTimer}>
                            {time.days ? <Timer value={Math.floor(time.days).toString()}
                                                title={translator('footer.timer.days')}/> : null}
                            {time.hours ? <Timer value={Math.floor(time.hours).toString()}
                                                 title={translator('footer.timer.hours')}/> : null}
                            {time.minutes ? <Timer value={Math.floor(time.minutes).toString()}
                                                   title={translator('footer.timer.minutes')}/> : null}
                        </div>
                    </footer>
                )
            }
        </div>
    );
}