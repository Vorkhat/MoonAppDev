import {SessionOptions} from "iron-session";

if (!process.env.SESSION_KEY) {
    throw new Error('Missing SESSION_KEY environment variable');
}

export interface SessionData {
    userId: number
}

export const sessionTtl = 3600 * 12; // 12 hours

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_KEY,
    cookieName: 'moon-session',
    ttl: sessionTtl,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    }
};