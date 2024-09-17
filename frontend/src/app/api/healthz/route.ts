import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    return new NextResponse('OK', { status: 200 });
}