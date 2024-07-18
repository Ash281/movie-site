import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const bodyText = await request.text();
    console.log('Request body:', bodyText);
    const { movieId, userId, like } = JSON.parse(bodyText);
    console.log('Movie ID:', movieId);
    console.log('User ID:', userId);
    try {
        // Create Movie table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS Movie (
                ID VARCHAR(255) PRIMARY KEY,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create UserLikesMovie table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS UserLikesMovie ( 
                UserID VARCHAR(255) NOT NULL, 
                MovieID VARCHAR(255) NOT NULL, 
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (UserID, MovieID),
                FOREIGN KEY (UserID) REFERENCES Users(ID),
                FOREIGN KEY (MovieID) REFERENCES Movie(ID)
            );
        `;

        // Insert movie if it doesn't exist
        await sql`
            INSERT INTO Movie (ID)
            SELECT ${movieId}
            WHERE NOT EXISTS (SELECT 1 FROM Movie WHERE ID = ${movieId});
        `;

        if (like) {
            // Insert like
            await sql`
                INSERT INTO UserLikesMovie (UserID, MovieID) VALUES (
                    ${userId},
                    ${movieId}
                )
                ON CONFLICT (UserID, MovieID) DO NOTHING;
            `;
            console.log('Movie liked successfully');
            return NextResponse.json({ message: 'Movie liked successfully' }, { status: 200 });
        } else {
            // Unlike movie
            await sql`
                DELETE FROM UserLikesMovie WHERE UserID = ${userId} AND MovieID = ${movieId};
            `;
            console.log('Movie unliked successfully');
            return NextResponse.json({ message: 'Movie unliked successfully' }, { status: 200 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
