import './theme.css';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import CreateQuizComponent from '@/components/pages/Quiz/CreateQuizComponent';
import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: [ 'latin' ] });

export default async function Quiz() {
    const { userId } = await useSession();
    const forms = await prisma.form.findMany({
        where: {
            completions: {
                none: {
                    userId: userId,
                    completedAt: {
                        not: null,
                    },
                },
            },
        },
        include: {
            title: {
                include: {
                    values: true,
                },
            },
        },
    });

    const t = await getTranslations('Quiz');

    return (
        <div className={styles.quiz_page}>
            <header className={`${styles.header__conrainer} ${inter.className}`}>
                {
                    forms.length ?
                    <>
                        <p style={{
                            fontSize: '3.6vh',
                            fontWeight: 'bold',
                            marginTop: '1vh',
                            textAlign: 'center',
                        }}>
                            {t('header.title')}<br/>
                            <span className={styles.header__text}>{t('header.content')}</span><br/>
                            <span className={`${styles.header__text} ${styles.text__color}`}> {t('header.footer')}</span>
                        </p>
                    </> :
                    <></>
                }
            </header>
            <main className={styles.quiz__list}>
                <CreateQuizComponent forms={forms}/>
            </main>
        </div>
    );
};