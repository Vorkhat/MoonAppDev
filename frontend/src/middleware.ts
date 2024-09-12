import { NextRequest, NextResponse } from 'next/server';
import { useSession } from '@/components/session';

const publicRoutes = [ '/' ];
const privilegedPattern = /^\/admin.*$/;
const localePattern = /^\/(ru|en).*$/;

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    if (localePattern.test(path)) {
        return NextResponse.next();
    }

    const session = await useSession();

    if (!isPublicRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/home', req.nextUrl));
    }

    if (privilegedPattern.test(path) && !session?.privileged) {
        return NextResponse.redirect(new URL('/home', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [ '/((?!api/init|_next/static|_next/image|.*\\.png$).*)' ],
};