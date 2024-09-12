import { FormElement, FormElementCaption, FormElementTextInput, FormElementType } from '@/utils/formElement';
import ContainerContent from '@/components/pages/common/components/ContainerContent/ContainerContent';
import { Inter } from 'next/font/google';
import styles from '@/components/pages/Quiz/styles.module.scss';
import React from 'react';
import { prisma } from '@/prisma';
import { useSession } from '@/components/session';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: [ 'latin' ] });

export default async function QuizForm({ elements }: { elements: FormElement[] }) {
    const t = await getTranslations('Quiz');

    return (
        <ContainerContent>
            <div className={`${styles.quiz} ${inter.className}`}>
                {elements.map(element => (
                    <QuizFormElementContent key={element.id} element={element}/>
                ))}

                <div className={styles.quizBorderBegin}>
                    <div className={styles.quizBegin}>
                        <button className={styles.quizBeginText} type="submit">{t('content.next-button')}</button>
                    </div>
                </div>
            </div>
        </ContainerContent>
    );
}

async function QuizFormElementContent({ element }: { element: FormElement }) {
    const { language } = await useSession();

    async function get(id?: number) {
        if (!id) return 'unset';

        const { value } = await prisma.localizationValue.findUniqueOrThrow({
            where: {
                id_language: {
                    id: id,
                    language: language,
                },
            },
            select: {
                value: true,
            },
        });

        return value || undefined;
    }

    switch (element.type) {
        case FormElementType.Caption:
            const caption = element as FormElementCaption;
            return (
                <>
                    <div className={styles.quizDescription}>
                        {await get(caption.text)}
                    </div>
                </>
            );
        case FormElementType.TextInput:
            const input = element as FormElementTextInput;
            return (
                <>
                    {
                        input.label
                        ? <label htmlFor={element.id}>{await get(input.label)}</label>
                        : <></>
                    }
                    <input type="text" name={element.id}
                           defaultValue={await get(input.defaultValue)}
                           placeholder={await get(input.placeholder)}/>
                </>
            );
    }
}