import './reset.scss';
import './globals.scss';
import React, { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import styles from './background.module.scss';
import Root from '@/components/root/Root';
import Theme from '@/components/theme/Theme';
import '../mockEnv.ts';
import { ViewTransitions } from 'next-view-transitions';
import TelegramSdk from '@/components/root/TelegramSdk';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: [ 'latin' ] });


export const metadata: Metadata = {
    title: 'Moon App',

};

export default async function RootLayout({ children }: PropsWithChildren) {

    return (
        <ViewTransitions>
            <html>
            <Theme>
                <body>
                <Root>
                    <div className={`${styles.background} ${inter.className}`}>
                        {children}
                        <div className={`${styles.background__gradient} ${styles.gradient__top_right}`}></div>
                        <div className={`${styles.background__gradient} ${styles.gradient__bottom_left}`}></div>
                    </div>
                </Root>
                </body>
            </Theme>
            <TelegramSdk/>
            </html>
        </ViewTransitions>
    );
}
