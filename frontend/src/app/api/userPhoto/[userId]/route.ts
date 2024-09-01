import {NextRequest, NextResponse} from 'next/server';
import {getUserAvatar} from "@/utils/UserPhoto/userPhoto.tsx";

export async function GET(req: NextRequest, { params }: { params: { userId: number } }) {
    if (!params.userId || isNaN(params.userId)) {
        return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    try {
        const {url, key} = await getUserAvatar(params.userId);
        const response = await fetch(url);

        const imageBuffer = await response.arrayBuffer();
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'private, max-age=3600',
                'Content-Length': imageBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch user photo' }, { status: 500 });
    }
}