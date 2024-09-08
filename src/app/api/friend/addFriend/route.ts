import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const { friendRespondId, friendRequestId, profileAvatar, image, name, country, actionDatetime } = await req.json();

    // Check if a friend request from friendRequestId to friendRespondId already exists
    const existingRequest = await prisma.friend.findFirst({
      where: {
        friendRespondId,
        friendRequestId,
        status: 'pending' // Optionally check for a specific status if needed
      }
    });

    if (existingRequest) {
      return NextResponse.json({ message: "Friend request already exists" }, { status: 400 });
    }

    const friendRequest = await prisma.friend.create({
      data: {
        friendRespondId,
        friendRequestId,
        profileAvatar,
        image,
        name,
        country,
        status: 'pending',
        actionDatetime
      },
    });

    return NextResponse.json({ friendRequest, message: "Friend added" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST request:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Unique constraint violation' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




export async function PUT(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(); // Get the current user
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { friendRequestId, status } = await req.json();
    
    // Find the friend request
    const existingRequest = await prisma.friend.findFirst({
      where: {
        friendRequestId,
      }
    });

    if (!existingRequest) {
      return NextResponse.json({ message: 'Friend request not found' }, { status: 404 });
    }

    // Update the friend request
    const updatedFriendRequest = await prisma.friend.update({
      where: { id: existingRequest.id },
      data: { status, actionDatetime: new Date() }
    });

    return NextResponse.json({ updatedFriendRequest, message: "Friend request updated" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(); // Get the current user

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { friendRequestId, friendRespondId } = await req.json();

    // Find the friend record based on friendRequestId and friendRespondId
    const friendRecord = await prisma.friend.findFirst({
      where: {
        friendRequestId,
        friendRespondId
      }
    });

    if (!friendRecord) {
      return NextResponse.json({ message: 'Friend record not found' }, { status: 404 });
    }

    // Delete the found friend record
    const deletedFriendRequest = await prisma.friend.delete({
      where: {
        id: friendRecord.id
      }
    });

    return NextResponse.json({ deletedFriendRequest, message: "Friend record deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(req: Request, res: Response) {
    try {
        const currentUser = await getCurrentUser()
        const user = await prisma.user.findUnique({
            where: { id: currentUser?.id },
            include: { friends: true },
        });
        return NextResponse.json({user, message: "Getting User"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error}, {status: 500})
    }
}