import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  try {
    const result =
      await sql `CREATE TABLE IF NOT EXISTS Users ( 
      Name VARCHAR(255) NOT NULL, 
      Email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY, 
      Password VARCHAR(255) NOT NULL,  
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    console.log('Table created successfully', result)
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error creating table', error)
    return NextResponse.json({ error }, { status: 500 });
  }
}