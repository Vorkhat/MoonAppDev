import {NextRequest, NextResponse} from 'next/server';
import {getUserAvatar} from "@/utils/UserPhoto/userPhoto.tsx";

export async function GET(req: NextRequest, { params }: { params: { userId: number } }) {
    const userId = Number(params.userId);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    try {
        const { url, key } = await getUserAvatar(userId);
        const etag = `\"${key}\"`;

        if (req.headers.get('If-None-Match') === etag) {
            return new NextResponse(null, { status: 304 }); // Not Modified
        }

        const response = await fetch(url);
        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public',
                'ETag': etag
            },
        });

    } catch (error) {
        console.error(error);

        // https://nextjs.org/docs/messages/middleware-relative-urls
        const url = req.nextUrl.clone();
        url.pathname = 'images/avatar.png';
        return NextResponse.redirect(url);
    }
}