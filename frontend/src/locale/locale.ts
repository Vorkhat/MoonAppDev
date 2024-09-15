import Cookies from 'js-cookie';
import { Language } from '@prisma/client';
import { cookies } from 'next/headers';
import { sessionTtl } from '@/components/session';

export function getCurrentLanguage() {
    'use client';
    return Cookies.get('lang')! as Language;
}

export async function getCurrentSessionLanguage() {
    'use server';

    return cookies().get('lang')!.value as Language;
}

export async function setCurrentSessionLanguage(language: Language) {
    'use server';

    cookies().set('lang', language, {
        maxAge: sessionTtl,
        sameSite: 'lax',
    });
}