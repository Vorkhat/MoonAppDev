import './theme.css';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import CreateQuizComponent from '@/components/pages/Quiz/CreateQuizComponent';
import { prisma } from '@/prisma';
import { useSession } from '@/components/session';

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

    return (
        <div className={styles.quiz_page}>
            <header className={`${styles.header__conrainer} ${inter.className}`}>
                {
                    forms.length ?
                    <>
                        <p style={{
                            fontSize: '3.6vh',
                            fontWeight: 'bold',
                        }}>Доступны новые квизы</p>
                        <p className={styles.header__text} style={{
                            marginTop: '1vh',
                        }}>Буст для твои поинтов чтобы</p>
                        <p className={`${styles.header__text} ${styles.text__color}`} style={{
                            color: 'var(--quiz-text-color-header-theme)',
                        }}> попасть в ТОП!</p>
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