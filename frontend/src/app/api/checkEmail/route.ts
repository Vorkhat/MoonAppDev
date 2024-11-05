import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await req.json();
        const response = await axios.post('https://api.motionfan.ru/api/v1/user/check_exists_user/', {
            email: email,
        }, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': process.env.ACCESS_TOKEN || '',
            },
        });

        const responseJson = response.data;
        return NextResponse.json({ message: responseJson, status: response.status });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            console.error("Error in axios fetch:", error.message);
            return NextResponse.json({ error: error.message }, { status: 404 });
        } else {
            return NextResponse.json({ error: 'Unknown error occurred' }, { status: 234 });
        }
    }
}
