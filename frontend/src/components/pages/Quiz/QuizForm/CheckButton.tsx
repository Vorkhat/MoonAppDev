'use client'

import { FormElementType } from '@/utils/formElement.ts';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useEmailContext } from '@/components/pages/Quiz/QuizForm/Email/EmailContext.tsx';
import styles from '@/components/pages/Quiz/QuizForm/styles.module.scss';

interface CheckButtonProps {
    type?: FormElementType.Caption | FormElementType.TextInput | FormElementType.Radio | FormElementType.Mail;
}

export function CheckButton({ type }: CheckButtonProps) {
    const { emailExists } = useEmailContext();
    const [buttonType, setButtonType] = useState<'button' | 'submit'>('submit');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const translator = useTranslations('Quiz');

    useEffect(() => {
        const checkEmailOnLoad = async () => {
            if (type === FormElementType.Mail) {
                try {
                    const response = await fetch('/api/get_user', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const userData = await response.json();

                    if (response.ok && userData.email) {
                        setButtonType('submit');
                    } else {
                        setButtonType('button');
                    }
                } catch (error) {
                    console.error('Ошибка при проверке почты:', error);
                }
            }
        };

        checkEmailOnLoad().catch(error => {
            console.error('Ошибка при выполнении checkEmailOnLoad:', error);
        });
    }, [emailExists, type]);

    const handleClick = () => {
        if (buttonType === 'button' && type === FormElementType.Mail) {
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 1000);
        }
    };

    return (
        <div className={styles.containerNext}>
            <button
                style={{
                    width: '100%',
                    padding: '1.5vh 0',
                    background: 'linear-gradient(90deg, #86F1AD 0, #8DBEFD 30%, #E0AAEE 100%)',
                    borderRadius: '2vw',
                    color: '#0C0C0C',
                    fontWeight: 'bold',
                }}
                type={buttonType}
                onClick={handleClick}
            >
                {translator('content.next-button')}
            </button>
            {showMessage && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    padding: '20px',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center',
                    zIndex: 1000,
                }}>
                    {translator('content.email-required')}
                </div>
            )}
        </div>
    );
}
