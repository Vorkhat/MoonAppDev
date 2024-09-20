import React, { PropsWithChildren, Suspense } from 'react';
import styles from '@/app/background.module.scss';
import Loading from './loading';
import Footer from '@/components/foooter/footer';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function ContentLayout({ children }: PropsWithChildren) {
    const messages = await getMessages();

    return (
        <>
            <NextIntlClientProvider messages={messages}>
                <main className={styles.content} style={{
                    viewTransitionName: 'content',
                }}>
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>
                </main>
                <footer className={styles.footer}><Footer/></footer>
            </NextIntlClientProvider>
        </>
    );
}