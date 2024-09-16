import '../../../app/(content)/quiz/theme.scss';
import Image from 'next/image';
import styles from './styles.module.scss';
import React from 'react';
import { Form, Language, LocalizationItem, LocalizationValue } from '@prisma/client';
import Link from 'next/link';
import ContainerColor from '@/common/ContainerColor';


declare type QuizForm = Form & { title: LocalizationItem & { values: LocalizationValue[] } };

const CreateQuizItem = ({ form }: { form: QuizForm }) => {
    return (
        <ContainerColor classNameBorder={styles.quizBorder} classNameBackground={styles.quizBackground}>
            <div className={styles.quiz}>
                <div className={styles.qiuzContentHeader}>
                    <div className={styles.headerContentTitle}>Quiz</div>
                    <Image className={styles.quizContentImage}
                           src={'/images/quiz/fox.svg'}
                           alt={''}
                           width={104}
                           height={103}>
                    </Image>
                    <Image className={styles.quizContentImage}
                           src={'/images/quiz/help.svg'}
                           alt={''}
                           width={12}
                           height={24}>

                    </Image>
                </div>
                <div className={styles.quizDescription}>
                    {form.title.values.find(b => b.language === Language.Ru)?.value}
                </div>
                {
                    form.reward ?
                    <ContainerColor
                        classNameBorder={[styles.rewardValueBorder, 'fit-conteiner']}
                        classNameBackground={[styles.rewardValueBackground, 'text-litle-container']}
                    >
                        + {form.reward} points
                    </ContainerColor>:
                    <></>
                }
                <div></div>
                <Link className={styles.quizBorderBegin} href={`/quiz/${form.id}`}>
                    <div className={styles.quizBegin}>
                        <span className={styles.quizBeginText}>Начать</span>
                    </div>
                </Link>
            </div>
        </ContainerColor>
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