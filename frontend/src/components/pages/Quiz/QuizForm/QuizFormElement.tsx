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
import { getCurrentSessionLanguage } from '@/locale/locale';
import { CheckEmail } from '@/components/pages/Quiz/QuizForm/Email/CheckEmail.tsx';
import { QuizContainer } from '@/components/pages/Quiz/QuizForm/QuizContainer.tsx';
import { CheckButton } from '@/components/pages/Quiz/QuizForm/CheckButton.tsx';


export default async function QuizForm({ elements }: { elements: FormElement[] }) {
    return (
        <div className={styles.quiz}>
            {elements.map(element => (
                <QuizFormElementContent key={element.id} element={element}/>
            ))}
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

    let content: React.ReactNode;

    switch (element.type) {
        case FormElementType.Caption:
            const caption = element as FormElementCaption;
            content = (
                <div className={styles.quizDescription}>
                    {await get(caption.text)}
                </div>
            );
            break;

        case FormElementType.TextInput:
            const input = element as FormElementTextInput;
            content = (
                <div className={styles.quizInput}>
                    {input.label && <label htmlFor={element.id}>{await get(input.label)}</label>}
                    <input
                        type="text"
                        name={element.id}
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
            );
            break;

        case FormElementType.Radio:
            const radio = element as FormElementRadio;
            content = (
                <div className={styles.radioGroup}>
                    {await Promise.all(
                        radio.options!.map(async ({ name, value }, index) => (
                            <div
                                key={`${element.id}-${index} ${styles.radioBorder}`}
                                style={{
                                    background: "var(--quiz-radio-border-gradient)",
                                    padding: "1px",
                                    borderRadius: "2vw",
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        width: "100%",
                                        background: "var(--quiz-radio-background-gradient)",
                                        borderRadius: "2vw",
                                    }}
                                >
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
                    )}
                </div>
            );
            break;

        case FormElementType.Mail:
            const mailInput = element as FormElementTextInput;
            const label = await get(mailInput.label);
            const defaultValue = await get(mailInput.defaultValue);
            const placeholder = await get(mailInput.placeholder);

            content = (
                <CheckEmail label={label} defaultValue={defaultValue} placeholder={placeholder} />
            );
            break;

    }

    return (
        <QuizContainer>
            {content}
            <CheckButton type={element.type}/>
        </QuizContainer>
    );
}