"use client";

import { useClerk } from '@clerk/nextjs';

const TestPage = () => {
    const { user } = useClerk();
    const clerkId = user?.id || null;

    return (
        <div>
            <h1>{clerkId}</h1>
        </div>
    );
}

export default TestPage;
