'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Error({ error }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('Error');

    if (process.env.NODE_ENV === 'development') {
        useEffect(() => console.log(error), [ error ]);
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateRows: '1fr auto',
            placeItems: 'center',
        }}>
            <h2>{t('header')}</h2>
            <p style={{
                opacity: '0.6',
            }}>{error.digest}</p>
        </div>
    );
}