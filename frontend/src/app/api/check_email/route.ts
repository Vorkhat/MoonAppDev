import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    const response = await fetch(
        'https://api.motionfan.ru/api/v1/user/check_exists_user/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': process.env.ACCESS_TOKEN || '',
            },
            body: JSON.stringify({ email: email }),
        },
    );

    return NextResponse.json({ message: response.statusText, status: response.status });
}
