'use client';

import Script from 'next/script';
import React from 'react';

export default function TelegramSdk() {
    return (
        <>
            <Script src="https://telegram.org/js/telegram-web-app.js" onLoad={() => {
                window.Telegram.WebApp.disableVerticalSwipes();
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();
                window.Telegram.WebApp.setHeaderColor("#000000")
            }}/>
        </>
    );
}