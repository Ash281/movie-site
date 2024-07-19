import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    console.log('Checking if user likes movie:', url.searchParams.toString());
    const userId = url.searchParams.get('userId');
    const movieId = url.searchParams.get('movieId');

    try {
        const result = await sql`
            SELECT COUNT(*) FROM UserLikesMovie
            WHERE UserID = ${userId} AND MovieID = ${movieId};
        `;
        console.log('User likes movie:', result.rows[0].count, 'User ID:', userId, 'Movie ID:', movieId);
        return NextResponse.json({ liked: result.rows[0].count > 0 || false }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}