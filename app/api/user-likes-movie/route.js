import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Create Movie table
        const createMovieTable = await sql`
            CREATE TABLE IF NOT EXISTS Movie (
                ID VARCHAR(255) NOT NULL PRIMARY KEY,
                Likes INT DEFAULT 0,
                Liked_by VARCHAR(255)
            )
        `;

        // Create UserLikesMovie table
        const createUserLikesMovieTable = await sql`
            CREATE TABLE IF NOT EXISTS UserLikesMovie ( 
                UserID VARCHAR(255) NOT NULL, 
                MovieID VARCHAR(255) NOT NULL, 
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (UserID, MovieID),
                FOREIGN KEY (UserID) REFERENCES Users(Email),
                FOREIGN KEY (MovieID) REFERENCES Movie(ID)
            )
        `;

        console.log('Tables created successfully');
        return NextResponse.json({ message: 'Tables created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating tables', error);
        return NextResponse.json({ error: 'Error creating tables' }, { status: 500 });
    }
}
