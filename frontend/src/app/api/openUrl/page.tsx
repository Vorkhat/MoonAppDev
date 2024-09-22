'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OpenUrlPage() {
    const searchParams = useSearchParams();

    const url = searchParams.get('url');

    if (url) {
        useEffect(() => {
            if (url.startsWith('https://t.me')) {
                window.Telegram.WebApp.openTelegramLink(url);
            }
            else {
                window.Telegram.WebApp.openLink(url);
            }
        });
    }

    return (
        <></>
    );
}