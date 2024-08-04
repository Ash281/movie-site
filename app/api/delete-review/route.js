import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const bodyText = await request.text();
    const { movieId, userId } = JSON.parse(bodyText);
    console.log('Movie ID:', movieId);
    console.log('User ID:', userId);

    try {
        // Create Movie table if it doesn't exist
        await sql`
            DELETE FROM UserReviewsMovie
            WHERE UserID = ${userId} AND MovieID = ${movieId};
        `;
        console.log('Review deleted successfully');
        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
