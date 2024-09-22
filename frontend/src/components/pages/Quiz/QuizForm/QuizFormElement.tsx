import {
    FormElement,
    FormElementCaption,
    FormElementRadio,
    FormElementTextInput,
    FormElementType,
} from '@/utils/formElement';
import styles from './styles.module.scss';
import React from 'react';
import { prisma } from '@/prisma';
import { getTranslations } from 'next-intl/server';
import { getCurrentSessionLanguage } from '@/locale/locale';
import ContainerColor from '@/common/ContainerColor';


export default async function QuizForm({ elements }: { elements: FormElement[] }) {
    const translator = await getTranslations('Quiz');

    return (
        <div className={styles.quiz}>
            {elements.map(element => (
                <QuizFormElementContent key={element.id} element={element}/>
            ))}

            <div className={styles.containerNext}>
                <ContainerColor classNameBorder={[ styles.quizBorderBegin, 'fit-container' ]}
                                classNameBackground={styles.quizBackgroundBegin}
                >
                    <button style={{
                        width: '100%',
                        height: '100%',
                        padding: '1.5vh 0',
                        background: "linear-gradient(90deg, #86F1AD 0, #8DBEFD 30%, #E0AAEE 100%)",
                        borderRadius: "2vw",
                        color: "#0C0C0C",
                        fontWeight: "bold"
                    }} type="submit">{translator('content.next-button')}</button>
                </ContainerColor>
            </div>
        </div>
    );
}

async function QuizFormElementContent({ element }: { element: FormElement }) {
    const language = await getCurrentSessionLanguage();

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
                    <div className={styles.quizDescription}>
                        {await get(caption.text)}
                    </div>
            );
        case FormElementType.TextInput:
            const input = element as FormElementTextInput;
            return (
                <>
                    <div className={styles.quizInput}>
                        {
                        input.label
                        ? <label htmlFor={element.id}>{await get(input.label)}</label>
                        : <></>
                    }
                        <input type="text" name={element.id}
                               defaultValue={await get(input.defaultValue)}
                               placeholder={await get(input.placeholder)}
                               style={{
                                   width: "100%",
                                   padding: "1vh 1vw",
                                   border: '1px solid #C4C4C4',
                                   background: "var(--quiz-background-input)",
                                   borderRadius: "2vw",
                               }}
                        />
                    </div>
                </>
            );
        case FormElementType.Radio:
            const radio = element as FormElementRadio;
            return (
                <div className={styles.radioGroup}>
                {
                        await Promise.all(
                            radio.options!.map(async ({ name, value }, index) => (
                                <div key={`${element.id}-${index} ${styles.radioBorder}`} style={{
                                    background: "var(--quiz-radio-border-gradient)",
                                    padding: "1px",
                                    borderRadius: "2vw",
                                }}>
                                    <div style={{
                                        position: "relative",
                                        display: "inline-block",
                                        width: "100%",
                                        background: "var(--quiz-radio-background-gradient)",
                                        borderRadius: "2vw",
                                    }}>
                                        <input
                                            type="radio"
                                            id={`${element.id}-${index}`}
                                            name={element.id}
                                            value={`${element.id}-${name}`}
                                            className={styles.radioElement}
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor={`${element.id}-${index}`} className={styles.customRadioLabel}>
                                            {await get(value)}
                                        </label>
                                    </div>
                                </div>
                            ))
                        )
                }
                </div>
            );
    }
}