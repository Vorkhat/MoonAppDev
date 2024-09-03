import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions} from "@/components/session";

const publicRoutes = ['/']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    // 5. Redirect to / if the user is not authenticated
    if (!isPublicRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // redirect from / to /home if the user is authenticated
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/home', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api/init|_next/static|_next/image|.*\\.png$).*)'],
}