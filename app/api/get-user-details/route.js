import { Clerk } from '@clerk/nextjs';

export async function GET(request) {
    const bodyText = await request.text();
    const { userId } = JSON.parse(bodyText);
    console.log('User ID:', userId);
    try {
        const user = await Clerk.users.getUser(userId);
        console.log('User details:', user);
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}