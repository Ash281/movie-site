import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const bodyText = await request.text();
    const { movieId, userId, review, rating } = JSON.parse(bodyText);
    console.log('Movie ID:', movieId);
    console.log('User ID:', userId);
    console.log('Review:', review);
    console.log('Rating:', rating);

    try {
        // Create Movie table if it doesn't exist
        await sql`
            UPDATE UserReviewsMovie
            SET Review = ${review}, Rating = ${rating}
            WHERE UserID = ${userId} AND MovieID = ${movieId};
        `;
        console.log('Review updated successfully');
        return NextResponse.json({ message: 'Review updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
