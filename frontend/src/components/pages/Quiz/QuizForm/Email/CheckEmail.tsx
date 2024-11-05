'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useEmailContext } from './EmailContext';

interface CheckEmailProps {
    label?: string | null;
    placeholder?: string | null;
    defaultValue?: string | null;
}

export function CheckEmail({ label, placeholder, defaultValue }: CheckEmailProps) {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false); // состояние загрузки
    const { setEmailExists } = useEmailContext();
    const translator = useTranslations('Quiz');

    const handleSubmit = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch(`/api/checkEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`Failed with status: ${response.status}`);
            }

            const data = await response.json();
            const status = data.status === 200;

            if (status) {
                await fetch(`/api/set_email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: true }),
                });
                setEmailExists(true);
            } else {
                setEmailExists(false);
            }

            setIsEmailValid(status);
            setResult(status ? `Email ${email} существует.` : `Email ${email} не найден.`);
        } catch (error) {
            console.error("Error during handleSubmit:", error);
            setResult("Произошла ошибка. Попробуйте снова.");
        } finally {
            setIsLoading(false);
        }

        setTimeout(() => {
            setResult(null);
            setIsEmailValid(null);
        }, 800);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 15 }}>
                <label htmlFor="email">{label}</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder || ''}
                    style={{
                        width: '100%',
                        padding: '1vh 1vw',
                        border: '1px solid #C4C4C4',
                        background: 'var(--quiz-background-input)',
                        borderRadius: '2vw',
                    }}
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        padding: '1.5vh 0',
                        background: 'linear-gradient(90deg, #8DBEFD 30%, #E0AAEE 100%)',
                        borderRadius: '2vw',
                        color: '#0C0C0C',
                        fontWeight: 'bold',
                    }}
                >
                    {isLoading ? 'Поиск...' : translator('content.check-button')}
                </button>
            </div>

            {result && (
                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: isEmailValid ? 'rgba(144,255,126,0.55)' : 'rgba(255, 99, 71, 0.55)',
                    padding: '10px',
                    color: 'black',
                    borderRadius: '8px',
                    textAlign: 'center',
                    zIndex: 1000,
                }}>
                    <p>{result}</p>
                </div>
            )}
        </>
    );
}
