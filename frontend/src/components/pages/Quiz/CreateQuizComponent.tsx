import './theme.css';
import Image from 'next/image';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';
import React from 'react';
import ContainerContent from '@/components/pages/common/components/ContainerContent/ContainerContent';
import { Form, Language, LocalizationItem, LocalizationValue } from '@prisma/client';
import Link from 'next/link';

const inter = Inter({ subsets: [ 'latin' ] });

declare type QuizForm = Form & { title: LocalizationItem & { values: LocalizationValue[] } };

const CreateQuizItem = ({ form }: { form: QuizForm }) => {
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
                <div className={styles.quizDescription}>
                    {form.title.values.find(b => b.language === Language.Ru)?.value}
                </div>
                {
                    form.reward ?
                    <AwardComponent>+ {form.reward} points</AwardComponent> :
                    <></>
                }
                <div></div>
                <Link className={styles.quizBorderBegin} href={`/quiz/${form.id}`}>
                    <div className={styles.quizBegin}>
                        <span className={styles.quizBeginText}>Начать</span>
                    </div>
                </Link>
            </div>
        </ContainerContent>
    );
};

export async function CreateQuizComponent({ forms }: { forms: QuizForm[] }) {
    return (
        <div className={styles.quizList}>
            {forms.map((form) => (
                <CreateQuizItem key={form.id} form={form}/>
            ))}
        </div>
    );
}

export default CreateQuizComponent;