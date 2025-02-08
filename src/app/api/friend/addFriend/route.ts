import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserFriends } from "@/app/actions/getUserFriends";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { friendRespondId, friendRequestId, profileAvatar, image, name, country, actionDatetime } = await req.json();

    // Validate required fields
    if (!friendRespondId || !friendRequestId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if users are trying to friend themselves
    if (friendRespondId === friendRequestId) {
      return NextResponse.json({ message: "Cannot send friend request to yourself" }, { status: 400 });
    }

    // Check if a friend request already exists in either direction
    const existingRequest = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            friendRespondId,
            friendRequestId,
          },
          {
            friendRespondId: friendRequestId,
            friendRequestId: friendRespondId,
          }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return NextResponse.json({ message: "Already friends" }, { status: 400 });
      }
      if (existingRequest.status === 'pending') {
        return NextResponse.json({ message: "Friend request already pending" }, { status: 400 });
      }
      // If the request was previously rejected, allow a new request
      await prisma.friend.delete({
        where: { id: existingRequest.id }
      });
    }

    // Create the friend request
    const friendRequest = await prisma.friend.create({
      data: {
        friendRespondId,
        friendRequestId,
        profileAvatar,
        image,
        name,
        country,
        status: 'pending',
        actionDatetime: new Date(), // Use server time instead of client time
        notification: 'unread'
      },
    });

    return NextResponse.json({ 
      friendRequest, 
      message: "Friend request sent successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST request:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Duplicate friend request' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { friendRequestId, status } = await req.json();

    // Validate required fields
    if (!friendRequestId || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate status value
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }
    
    // Find the friend request and ensure it's pending
    const existingRequest = await prisma.friend.findFirst({
      where: {
        AND: [
          { friendRequestId },
          { friendRespondId: currentUser.id }, // Ensure the current user is the responder
          { status: 'pending' } // Only allow updating pending requests
        ]
      }
    });

    if (!existingRequest) {
      return NextResponse.json({ 
        message: 'Friend request not found or already processed' 
      }, { status: 404 });
    }

    // Update the friend request
    const updatedFriendRequest = await prisma.friend.update({
      where: { id: existingRequest.id },
      data: { 
        status,
        actionDatetime: new Date(),
        notification: 'unread' // Reset notification status for the requester
      }
    });

    // If request is accepted, create a reverse record to establish bidirectional friendship
    if (status === 'accepted') {
      await prisma.friend.create({
        data: {
          friendRespondId: existingRequest.friendRequestId,
          friendRequestId: existingRequest.friendRespondId,
          status: 'accepted',
          actionDatetime: new Date(),
          profileAvatar: currentUser.profileAvatar || '',
          image: currentUser.image || '',
          name: currentUser.name || '',
          country: currentUser.country || '',
          notification: 'unread'
        }
      });
    }

    const message = status === 'accepted' 
      ? "Friend request accepted" 
      : "Friend request rejected";

    return NextResponse.json({ 
      updatedFriendRequest, 
      message 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { friendRequestId, friendRespondId } = await req.json();

    // Find friend record in either direction
    const friendRecord = await prisma.friend.findFirst({
      where: {
        OR: [
          { friendRequestId, friendRespondId },
          { friendRequestId: friendRespondId, friendRespondId: friendRequestId }
        ]
      }
    });

    if (!friendRecord) {
      return NextResponse.json({ message: 'Friend record not found' }, { status: 404 });
    }

    const deletedFriendRequest = await await prisma.friend.deleteMany({
      where: {
        OR: [
          {
            friendRequestId: friendRequestId,
            friendRespondId: friendRespondId,
          },
          {
            friendRequestId: friendRespondId,
            friendRespondId: friendRequestId,
          },
        ],
      },
    });

    return NextResponse.json({ deletedFriendRequest, message: "Friend record deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('friQ') || '';
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const friends = await prisma.friend.findMany({
      where: {
        AND: [
          {
            OR: [
              { friendRequestId: userId },
              { friendRespondId: userId }
            ]
          },
          { status: 'accepted' },
          query ? {
            OR: [
              {
                responder: {
                  OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { country: { contains: query, mode: 'insensitive' } }
                  ]
                }
              },
              {
                requester: {
                  OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { country: { contains: query, mode: 'insensitive' } }
                  ]
                }
              }
            ]
          } : {}
        ]
      },
      include: {
        responder: {
          select: {
            id: true,
            name: true,
            image: true,
            profileAvatar: true,
            country: true
          }
        },
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
            profileAvatar: true,
            country: true
          }
        }
      }
    });

    const transformedFriends = friends.map(friend => {
      const friendInfo = friend.friendRequestId === userId ? friend.responder : friend.requester;
      
      return {
        id: friend.id,
        friendId: friendInfo.id,
        name: friendInfo.name,
        image: friendInfo.image,
        profileAvatar: friendInfo.profileAvatar,
        country: friendInfo.country,
        status: friend.status,
        friendRequestId: friend.friendRequestId,
        friendRespondId: friend.friendRespondId,
        actionDatetime: friend.actionDatetime,
        notification: friend.notification,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt
      };
    });

    return NextResponse.json({ 
      users: transformedFriends, 
      message: 'Friends retrieved successfully' 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Friend search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search friends',
      details: error.message 
    }, { status: 500 });
  }
}