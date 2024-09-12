import { prisma } from '@/prisma.ts';
import { redirect } from 'next/navigation';
import { setUserLocale } from '@/locale/locale';
import { startTransition } from 'react';
import { Locale } from '@/i18n/config';

async function getUserLanguage(userId: number) {
    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { language: true },
        });
        return user?.language;
    }
}

export default async function LanguageSwitcher({ userId }: { userId: number }) {

    const language = await getUserLanguage(userId);

    async function saveLanguage() {
        'use server';

        const newLanguage = language === 'Ru' ? 'En' : 'Ru';
        const locale = newLanguage as Locale;

        startTransition(() => {
            setUserLocale(locale);
        });

        await prisma.user.update({
            where: { id: userId },
            data: { language: newLanguage },
        });

        redirect('/home');
    }

    return (
        <>
            <form action={saveLanguage}>
                <button type="submit" value={language}>
                    {language === 'Ru' ? 'EN' : 'RU'}
                </button>
            </form>
        </>
    );
}
