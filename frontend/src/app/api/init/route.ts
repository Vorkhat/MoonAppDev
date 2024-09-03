import {NextRequest, NextResponse} from "next/server";
import {InitDataParsed, validate} from "@telegram-apps/init-data-node";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions, sessionTtl} from "@/components/session";
import {cookies} from "next/headers";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { initData }: { initData: InitDataParsed } = await req.json();

    if (!process.env.BOT_TOKEN) {
        throw new Error('Missing BOT_TOKEN environment variable');
    }

    try {
        validate(initData, process.env.BOT_TOKEN, { expiresIn: sessionTtl });
    } catch (validationError: any) {
        if (process.env.NODE_ENV === 'production') {
            return new NextResponse(null, { status: 400, statusText: validationError });
        }

        console.warn(validationError);
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    session.userId = initData.user!.id;

    await session.save();

    return new NextResponse(null, { status: 204 });
}