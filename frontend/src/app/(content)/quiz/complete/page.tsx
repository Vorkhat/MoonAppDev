import './theme.css';
import Image from 'next/image';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import ContainerContent from '@/components/pages/common/components/ContainerContent/ContainerContent';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: [ 'latin' ] });

export default async function QuizComplete() {

    const t = await getTranslations('QuizComplete');

    return (
        <div className={`${styles.quizCompletePage} ${inter.className}`}>
            <span style={{
                color: 'var(--text-color)',
                fontSize: '1.5em',
                fontWeight: 'bold',
            }}>{t('header')}</span>
            <ContainerContent>
                <div className={styles.quizContent}>
                    <Image src={'/images/tasks/complete.svg'} style={{
                        background: '#1B1E23',
                        padding: '1vh 1vw 1vh 1.3vw',
                        borderRadius: '2vw',
                    }} alt="" width={40} height={40}/>
                    <span className={styles.textContent} style={{
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                    }}>{t('content')}</span>
                </div>
            </ContainerContent>
        </div>
    );
};