import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const movieId = url.searchParams.get('movieId');
    // console.log('Checking if user has reviewed movie:', userId);

    try {
        const user_review = await sql`
            SELECT r.*, u.name
            FROM UserReviewsMovie r
            LEFT JOIN Users u ON r.UserID = u.ID
            WHERE r.UserID = ${userId} AND r.MovieID = ${movieId};
        `;

        console.log('checking if user has reviewed movie:', user_review.rows, userId);
        if (!user_review.rows || user_review.rows.length === 0) {
            return NextResponse.json({message: 'User has not reviewed this movie yet'});
        }

        return NextResponse.json(user_review.rows);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
