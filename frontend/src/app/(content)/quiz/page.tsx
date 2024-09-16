import './theme.scss';
import styles from './styles.module.scss';
import CreateQuizComponent from '@/components/pages/Quiz/CreateQuizComponent';
import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';
import ContainerColor from '@/common/ContainerColor';


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

    const translator = await getTranslations('Quiz');
    const translatorUndefined = await getTranslations('QuizUndefined');

    return (
        <div className={styles.quiz_page}>
            <div className={styles.header__conrainer}>
                {
                    forms.length ?
                    <>
                        <p style={{
                            fontSize: '3.6vh',
                            fontWeight: 'bold',
                            marginTop: '1vh',
                            textAlign: 'center',
                        }}>
                            {translator('header.title')}<br/>
                            <span className={styles.header__text}>
                                {translator('header.content')}
                            </span><br/>
                            <span className={`${styles.header__text} ${styles.text__color}`}>
                                {translator('header.footer')}
                            </span>
                        </p>
                    </> :
                    <>
                        <div className={styles.QuizUndefined}>
                            <span style={{
                                color: 'var(--text-color)',
                                fontSize: '1.5em',
                                fontWeight: 'bold',
                            }}>
                                {translatorUndefined('header')}
                            </span>
                            <ContainerColor classNameBorder={styles.quizBorder} classNameBackground={styles.quizBackground}>
                                <div className={styles.quizContent}>
                                    <span className={styles.textContent}
                                          style={{
                                              fontSize: '1.3em',
                                              fontWeight: 'bold',
                                          }}>
                                        {translatorUndefined('content')}
                                    </span>
                                </div>
                            </ContainerColor>
                        </div>
                    </>
                }
            </div>
            <div className={styles.quiz__list}>
                <CreateQuizComponent forms={forms}/>
            </div>
        </div>
    );
};