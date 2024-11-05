import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await req.json();
        console.log(email)
        console.log(process.env.ACCESS_TOKEN)
        const response = await fetch('https://api.motionfan.ru/api/v1/user/check_exists_user/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': process.env.ACCESS_TOKEN || '',
            },
            body: JSON.stringify({ email: email }),
        });

        console.log(response)

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch failed with status: ${response.status}, message: ${errorText}`);
        }

        const responseJson = await response.json();
        console.log(responseJson)
        return NextResponse.json({ message: responseJson, status: response.status });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            console.error("Error in fetch:", error.message);
            return NextResponse.json({ error: error.message }, { status: 404 });
        } else {
            return NextResponse.json({ error: 'Unknown error occurred' }, { status: 234 });
        }
    }
}
