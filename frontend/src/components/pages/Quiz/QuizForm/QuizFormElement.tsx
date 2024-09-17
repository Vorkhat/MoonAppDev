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

            <ContainerColor classNameBorder={[styles.quizBorderBegin, 'fit-conteiner']}
                            classNameBackground={styles.quizBackgroundBegin}
            >
                <button style={{
                    width: '100%',
                    height: '100%',
                }} type="submit">{translator('content.next-button')}</button>
            </ContainerColor>
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
                            radio.options!.map(async ({ name, value }) => (
                                <>
                                    <label htmlFor={element.id}>{await get(value)}</label>
                                    <input type="radio" name={element.id} value={`${element.id}-${name}`}/>
                                </>
                            )),
                        )
                    }
                </div>
            );
    }
}