import {NextRequest, NextResponse} from 'next/server';
import {getUserAvatar} from "@/utils/UserPhoto/userPhoto.tsx";

export async function GET(req: NextRequest, { params }: { params: { userId: number } }) {
    const userId = Number(params.userId);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    try {
        const { url } = await getUserAvatar(userId);
        const response = await fetch(url);
        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'private, max-age=3600',
            },
        });

    } catch (error) {
        console.error(error);

        // https://nextjs.org/docs/messages/middleware-relative-urls
        const url = req.nextUrl.clone();
        url.pathname = 'images/Avatar.png';
        return NextResponse.redirect(url);
    }
}