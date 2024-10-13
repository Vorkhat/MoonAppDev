import { NextRequest, NextResponse } from 'next/server';
import { useSession } from '@/components/session';
import { prisma } from '@/prisma.ts';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await useSession();

    let emailData;
    try {
        emailData = await req.json();
    } catch (error) {
        console.error('Ошибка при разборе JSON:', error);
        return NextResponse.json({ message: 'Некорректный запрос' }, { status: 400 });
    }

    if (!emailData?.email) {
        return NextResponse.json({ message: 'Параметр email не найден' }, { status: 400 });
    }

    const user = await prisma.user.updateMany({
        data: {
            email: emailData.email
        },
        where: {
            id: session.userId
        }
    });

    if (user) {
        return NextResponse.json({ message: "ok" }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'Пользователь не найден' }, { status: 420 });
    }
}
