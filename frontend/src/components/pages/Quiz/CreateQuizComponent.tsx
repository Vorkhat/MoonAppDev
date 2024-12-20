import '../../../app/(content)/quiz/theme.scss';
import Image from 'next/image';
import styles from './styles.module.scss';
import React from 'react';
import { Form, LocalizationItem, LocalizationValue } from '@prisma/client';
import Link from 'next/link';
import foxIcon from '@/app/(content)/quiz/images/fox.svg';
import helpIcon from '@/app/(content)/quiz/images/help.svg';
import ContainerColor from '@/common/ContainerColor';
import { getTranslations } from 'next-intl/server';
import { router } from 'next/client';
import { redirect } from 'next/navigation';


declare type QuizForm = Form & { title: LocalizationItem & { values: LocalizationValue[] } };

const CreateQuizItem = async ({ form }: { form: QuizForm }) => {

    const translator = await getTranslations('Quiz');
    return (
        <ContainerColor classNameBorder={styles.quizBorder} classNameBackground={styles.quizBackground}>
            <div className={styles.quiz}>
                <div className={styles.qiuzContentHeader}>
                    <div className={styles.headerContentTitle}>Quiz</div>
                    <Image className={styles.quizContentImage}
                           src={foxIcon}
                           alt={''}
                           width={104}
                           height={103}>
                    </Image>
                    <Image className={styles.quizContentImage}
                           src={helpIcon}
                           alt={''}
                           width={12}
                           height={24}
                    >
                    </Image>
                </div>
                <div className={styles.quizDescription}>
                    {form.title.values.at(0)?.value}
                </div>
                {
                    form.reward ?
                        <h6 className={`${styles.reward} ${styles.rewardBorder} gradient-border`}>+ {form.reward} баллов</h6> :
                    <></>
                }
                <div></div>
                <Link className={styles.quizBorderBegin} href={`/quiz/${form.id}`}>
                    <div className={styles.quizBegin}>
                        <span className={styles.quizBeginText}>{translator('content.begin-button')}</span>
                    </div>
                </Link>
            </div>
        </ContainerColor>
    );
};

export async function CreateQuizComponent({ forms }: { forms: QuizForm[] }) {
    return (
        <div className={styles.quizList}>
            {forms.map((form) =>
                form.isVisible ? (
                    <CreateQuizItem key={form.id.toString()} form={form} />
                ) : '',
            )}
        </div>
    );
}

export default CreateQuizComponent;