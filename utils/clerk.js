import { useClerk } from '@clerk/nextjs';

export async function getClerkId() {
    const { user } = useClerk();
    const clerkId = user.id;
  
    return clerkId;
  }