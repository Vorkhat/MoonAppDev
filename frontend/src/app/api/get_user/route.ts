import { NextRequest, NextResponse } from 'next/server';
import { useSession } from '@/components/session';
import { prisma } from '@/prisma.ts';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await useSession();

    const user = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
    });

    if (user) {
        const userResponse = {
            ...user,
            id: user.id.toString(),
        };

        return NextResponse.json(userResponse, { status: 200 });
    } else {
        return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }
}
