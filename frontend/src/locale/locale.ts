'use server';

import {Locale, defaultLocale} from '@/i18n/config';
import { useSession } from '@/components/session';

export async function getUserLocale() {
    const session = await useSession();
    return session.language || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    const session = await useSession();
    session.language = locale || defaultLocale;
    await session.save();
}

//const COOKIE_NAME = 'NEXT_LOCALE'
//export async function getUserLocale() {
  //  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
//}

//export async function setUserLocale(locale: Locale) {
//    cookies().set('NEXT_LOCALE', locale)
//}