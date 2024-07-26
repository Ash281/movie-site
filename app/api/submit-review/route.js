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
            CREATE TABLE IF NOT EXISTS Movie (
                ID VARCHAR(255) PRIMARY KEY,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create UserReviewsMovie table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS UserReviewsMovie ( 
                UserID VARCHAR(255) NOT NULL, 
                MovieID VARCHAR(255) NOT NULL, 
                Review TEXT,
                Rating DECIMAL(2, 1) CHECK (Rating >= 1.0 AND Rating <= 5.0),
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (UserID, MovieID),
                FOREIGN KEY (UserID) REFERENCES Users(ID),
                FOREIGN KEY (MovieID) REFERENCES Movie(ID)
            );
        `;

        // Insert movie if it doesn't exist
        await sql`
            INSERT INTO Movie (ID)
            VALUES (${movieId})
            ON CONFLICT (ID) DO NOTHING;
        `;

        if (review || rating !== undefined) {
            // Insert review and rating or update if they exist
            await sql`
                INSERT INTO UserReviewsMovie (UserID, MovieID, Review, Rating) VALUES (
                    ${userId},
                    ${movieId},
                    ${review},
                    ${rating}
                )
                ON CONFLICT (UserID, MovieID)
                DO UPDATE SET Review = EXCLUDED.Review, Rating = EXCLUDED.Rating;
            `;
            console.log('Review and rating submitted successfully');
            return NextResponse.json({ message: 'Review and rating submitted successfully' }, { status: 200 });
        } else {
            console.log('Review and rating cannot be empty');
            return NextResponse.json({ message: 'Review and rating cannot be empty' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
