import {NextRequest, NextResponse} from 'next/server';
import UserPhoto from "@/components/UserPhoto/Photo";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || isNaN(Number(userId))) {
        return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    try {
        const photoUrl = await UserPhoto(Number(userId));
        const response = await fetch(photoUrl);

        const imageBuffer = await response.arrayBuffer();
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache image for 1 year
                'Content-Length': imageBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user photo' }, { status: 500 });
    }
}