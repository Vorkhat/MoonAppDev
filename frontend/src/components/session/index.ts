import { getIronSession, SessionOptions } from 'iron-session';
import '@/envConfig.ts';
import { cookies } from 'next/headers';

if (!process.env.SESSION_KEY) {
    throw new Error('Missing SESSION_KEY environment variable');
}

export interface SessionData {
    userId: number;
    username?: string;
    firstName: string;
    lastName?: string;
    privileged?: boolean;
}

export const sessionTtl = 3600 * 12; // 12 hours

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_KEY,
    cookieName: 'moon-session',
    ttl: sessionTtl,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    },
};

export async function useSession() {
    'use server';
    return getIronSession<SessionData>(cookies(), sessionOptions);
}