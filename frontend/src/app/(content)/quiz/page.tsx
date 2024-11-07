import './theme.scss';
import styles from './styles.module.scss';
import CreateQuizComponent from '@/components/pages/Quiz/CreateQuizComponent';
import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';
import ContainerColor from '@/common/ContainerColor';
import { getCurrentSessionLanguage } from '@/locale/locale';


export default async function Quiz() {
    const { userId } = await useSession();
    const language = await getCurrentSessionLanguage();
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
        select: {
            id: true,
            reward: true,
            titleId: true,
            isVisible: true,
            title: {
                select: {
                    id: true,
                    values: {
                        where: {
                            language: language,
                        },
                    },
                },
            },
        },
    });

    const visibleForms = forms.filter(form => form.isVisible);
    const translatorUndefined = await getTranslations('QuizUndefined');

    return (
        <div className={styles.quiz_page}>
            <div className={styles.header__conrainer}>
                {
                    visibleForms.length > 0 ?
                    <>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyItems: 'center'
                        }}>
                            <strong style={{margin: 'auto', marginBottom: '10px'}}>Доступны новые квизы</strong>
                            <div>Получи 300 бонусов за регистрацию</div>
                            <div>в мобильном приложении MotionFan</div>
                        </div>
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
                            <ContainerColor classNameBorder={styles.quizBorder}
                                            classNameBackground={styles.quizBackground}>
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