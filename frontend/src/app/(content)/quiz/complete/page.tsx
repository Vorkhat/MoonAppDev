import '../theme.scss';
import Image from 'next/image';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';
import ContainerColor from '@/common/ContainerColor';


export default async function QuizComplete() {

    const t = await getTranslations('QuizComplete');

    return (
        <div className={styles.quizCompletePage}>
            <span style={{
                color: 'var(--text-color)',
                fontSize: '1.5em',
                fontWeight: 'bold',
            }}>
                {t('header')}
            </span>
            <ContainerColor classNameBorder={styles.quizBorder} classNameBackground={styles.quizBackground}>
                <div className={styles.quizContent}>
                    <Image src={'/images/tasks/complete.svg'}
                           style={{
                               background: '#1B1E23',
                               padding: '1vh 1vw 1vh 1.3vw',
                               borderRadius: '2vw',
                           }}
                           alt=""
                           width={40}
                           height={40}/>
                    <span className={styles.textContent}
                          style={{
                              fontSize: '1.3em',
                              fontWeight: 'bold',
                          }}>
                        {t('content')}
                    </span>
                </div>
            </ContainerColor>
        </div>
    );
};