import fs from 'fs';
import path from 'path';
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

    } catch {
        const failImagePath = path.join(process.cwd(), 'public/images', 'Avatar.png');
        const failImageBuffer = fs.readFileSync(failImagePath);

        return new NextResponse(failImageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'private, max-age=3600',
            },
        });
    }
}