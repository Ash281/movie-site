import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    console.log('Checking if user likes movie:', url.searchParams.toString());
    const userId = url.searchParams.get('userId');
    const movieId = url.searchParams.get('movieId');

    try {
        const user_review = await sql`
            SELECT r.*, u.name
            FROM UserReviewsMovie r
            LEFT JOIN Users u ON r.UserID = u.ID
            WHERE r.UserID = ${userId} AND r.MovieID = ${movieId};
        `;

        // const user_review = await sql`
        //     SELECT * FROM UserReviewsMovie
        //     WHERE UserID = ${userId} AND MovieID = ${movieId};
        // `;

        const all_reviews = await sql`
            SELECT r.*, u.name
            FROM UserReviewsMovie r
            LEFT JOIN Users u ON r.UserID = u.ID
            WHERE r.MovieID = ${movieId};
        `;

        // const all_reviews = await sql`
        //     SELECT * FROM UserReviewsMovie
        //     WHERE MovieID = ${movieId};
        // `;

        const average_rating = await sql`
            SELECT AVG(Rating) AS average_rating FROM UserReviewsMovie
            WHERE MovieID = ${movieId};
        `;
        
        // if (user_review.rows.length === 0) {
        //     return NextResponse.json({ error: 'No review found for the given user and movie.' }, { status: 404 });
        // }

        console.log('User review:', user_review.rows[0], 'All reviews:', all_reviews.rows, 'Average rating:', average_rating.rows[0].average_rating);
        return NextResponse.json({
            user_review: user_review.rows[0],
            all_reviews: all_reviews.rows,
            average_rating: average_rating.rows[0].average_rating
        }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
