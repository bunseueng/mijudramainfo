import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { friendRespondId, friendRequestId, profileAvatar, image, name, country, actionDatetime } = await req.json();
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
        return NextResponse.json({friendRequest, message: "Friend added"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error}, {status: 500})
  }
}

export async function PUT(req: Request, res: Response) {
    try {
    const user = await getCurrentUser(); // Get the current user
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, {status: 404});
    }

    const { friendRequestId, status } = await req.json();
    
    const updatedFriendRequest = await prisma.friend.update({
      where: { friendRequestId: friendRequestId as any}, // Update based on the friendRequestId
      data: { status, actionDatetime: new Date() },
    });

    return NextResponse.json({updatedFriendRequest, message: "Friend accepted/rejected"}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error}, {status: 500})
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(); // Get the current user

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, {status: 404});
    }

    const { friendRequestId} = await req.json();

    const updatedFriendRequest = await prisma.friend.delete({
      where: {
        friendRequestId: friendRequestId as any
      }
    });

    return NextResponse.json({updatedFriendRequest, message: "Friend accepted/rejected"}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error}, {status: 500})
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