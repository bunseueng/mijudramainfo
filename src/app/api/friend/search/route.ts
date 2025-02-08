// app/api/users/search/route.ts
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  try {
    // Implement server-side pagination
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        profileAvatar: true,
        image: true,
        country: true
      },
      take: 10 // Limit results
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.error();
  }
}
