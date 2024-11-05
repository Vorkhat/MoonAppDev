import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await req.json();

        const response = await fetch('https://api.motionfan.ru/api/v1/user/check_exists_user/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': process.env.ACCESS_TOKEN || '',
            },
            body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch failed with status: ${response.status}, message: ${errorText}`);
        }

        const responseJson = await response.json();
        return NextResponse.json({ message: responseJson, status: response.status });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in fetch:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
        }
    }
}
