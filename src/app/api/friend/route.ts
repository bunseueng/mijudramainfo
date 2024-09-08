import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/actions/getCurrentUser';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();

    // Extract the query parameter from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('friQ') || ''; // Default to an empty string if not provided

    // Query the friends table with optional search criteria
    const user = await prisma.friend.findMany({
      where: {
        OR: [
          { friendRequestId: currentUser?.id },
          { friendRespondId: currentUser?.id },
        ],
        ...(query && { // Apply search only if query is present
          friendRespond: {
            name: {
              contains: query,
              mode: 'insensitive', // Optional: makes the search case-insensitive
            },
          },
        }),
      },
      include: {
        friendRespond: true, // Include related data if needed
        friendRequest: true, // Include if needed for completeness
      },
    });

    return NextResponse.json({ user, message: 'Getting User' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
