import './reset.scss';
import './globals.scss';
import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import styles from './background.module.scss';
import Root from '@/components/root/Root';
import Theme from '@/components/theme/Theme';
import Footer from '@/components/foooter/footer';
import '../mockEnv.ts';
import { ViewTransitions } from 'next-view-transitions';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Moon App',

};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    const messages = await getMessages();
    return (
        <ViewTransitions>
            <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <Theme>
                    <body>
                    <Root>
                        <div className={styles.background}>
                            <main className={styles.content}>
                                {children}
                            </main>
                            <footer className={styles.footer}><Footer/></footer>
                            <div className={`${styles.background__gradient} ${styles.gradient__top_right}`}></div>
                            <div className={`${styles.background__gradient} ${styles.gradient__bottom_left}`}></div>
                        </div>
                    </Root>
                    </body>
                </Theme>
            </NextIntlClientProvider>
            <Script src="https://telegram.org/js/telegram-web-app.js"/>
            </html>
        </ViewTransitions>
    );
}
