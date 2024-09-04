import {NextRequest, NextResponse} from "next/server";
import {validate} from "@telegram-apps/init-data-node";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions, sessionTtl} from "@/components/session";
import {cookies} from "next/headers";
import {prisma} from "@/prisma.ts";
import {parseInitData} from "@telegram-apps/sdk";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const initDataRaw = await req.text();
    const initData = parseInitData(initDataRaw);

    if (!process.env.BOT_TOKEN) {
        throw new Error('Missing BOT_TOKEN environment variable');
    }

    try {
        validate(initDataRaw, process.env.BOT_TOKEN, { expiresIn: sessionTtl });
    } catch (validationError: any) {
        if (process.env.NODE_ENV === 'production') {
            return new NextResponse(null, { status: 400, statusText: validationError });
        }

        console.warn(validationError);
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    session.userId = initData.user!.id;
    session.username = initData.user!.username;
    session.firstName = initData.user!.firstName;
    session.lastName = initData.user!.lastName;

    await session.save();

    if (!await prisma.user.findUnique({where: {id: session.userId}})) {
        await prisma.user.create({
            data: {
                id: session.userId
            }
        });
    }

    return new NextResponse(null, { status: 204 });
}