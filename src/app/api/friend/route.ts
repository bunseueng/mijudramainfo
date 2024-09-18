import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('friQ') || ''; // Default to an empty string if not provided
    const userId = searchParams.get('userId'); // Extract userId from query params

    // Ensure userId is present
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Query the friends table with optional search criteria
    const users = await prisma.friend.findMany({
      where: {
        OR: [
          { friendRequestId: userId },
          { friendRespondId: userId },
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

    return NextResponse.json({ users, message: 'Getting User' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
