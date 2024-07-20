import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    console.log('Getting user likes:', userId);

    try {
        const result = await sql`
            SELECT MovieID FROM UserLikesMovie
            WHERE UserID = ${userId};
        `;
        console.log('User likes:', result.rows);
        return NextResponse.json({ likes: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}