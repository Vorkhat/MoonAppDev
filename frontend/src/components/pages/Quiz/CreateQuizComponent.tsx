import './theme.css';
import Image from 'next/image';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';
import React from 'react';
import ContainerContent from '@/components/pages/common/components/ContainerContent/ContainerContent';

const inter = Inter({ subsets: [ 'latin' ] });

const CreateQuizItem = () => {
    return (
        <ContainerContent>
            <div className={`${styles.quiz} ${inter.className}`}>
                <div className={styles.qiuzContentHeader}>
                    <div className={styles.headerContentTitle}>Quiz</div>
                    <Image className={styles.quizContentImage} src={'/images/quiz/fox.svg'} alt={''} width={104}
                           height={103}></Image>
                    <Image className={styles.quizContentImage} src={'/images/quiz/help.svg'} alt={''} width={12}
                           height={24}></Image>
                </div>
                <div className={styles.quizDescription}>Совершите покупку в нашем интернет-магазине</div>
                <AwardComponent>+ 1000 points</AwardComponent>
                <div className={styles.quizBorderBegin}>
                    <div className={styles.quizBegin}>
                        <span className={styles.quizBeginText}>Начать</span>
                    </div>
                </div>
            </div>
        </ContainerContent>
    );
};

export async function CreateQuizComponent() {
    return (
        <div className={styles.quizList}>
            <CreateQuizItem/>
            <CreateQuizItem/>
            <CreateQuizItem/>
        </div>
    );
}

export default CreateQuizComponent;