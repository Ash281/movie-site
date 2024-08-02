import { sql } from '@vercel/postgres';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function handleWebhookEvent(payload) {
    const { data, type } = payload;

    if (type === 'user.created') {
        // Extract user details from the payload
        const { id, first_name, last_name, email_addresses, profile_image_url } = data;

        // Handle the user created event
        await sql`
            CREATE TABLE IF NOT EXISTS Users (
                ID VARCHAR(255) PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Email VARCHAR(255) UNIQUE NOT NULL,
                Password VARCHAR(255) NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            INSERT INTO Users (ID, Name, Email, Password, CreatedAt) VALUES (
                ${id},
                ${first_name + ' ' + last_name},
                ${email_addresses[0].email_address},
                'default_password', -- Replace with the actual password if available
                CURRENT_TIMESTAMP
            )
        `;
        console.log(`User with ID ${id} created`);
    } else if (type === 'user.updated') {
        const { id, first_name, last_name, email_addresses } = data;

        // Handle the user updated event
        await sql`
            UPDATE Users SET
                Name = ${first_name + ' ' + last_name},
                Email = ${email_addresses[0].email_address}
            WHERE ID = ${id}
        `;
        console.log(`User with ID ${id} updated`);
    } else if (type === 'user.deleted') {
        const { id } = data;

        // Handle the user deleted event
        await sql`
            DELETE FROM Users WHERE ID = ${id}
        `;
        console.log(`User with ID ${id} deleted`);
    } else {
        console.log(`Unknown event type: ${type}`);
    }
}

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', { status: 400 });
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    await handleWebhookEvent(evt);

    return new Response('', { status: 200 });
}
