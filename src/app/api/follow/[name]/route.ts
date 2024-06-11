import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { name: string } }) {
  try {
    const currentUser = await getCurrentUser(); // Get the current user

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { name: currentUser?.name }
    });

    const followUser = await prisma.user.findUnique({
      where: { name: params.name }
    });

    if (!followUser) {
      return NextResponse.json({ error: 'User to follow not found' }, { status: 403 });
    }

    const following = await prisma.user.update({
      where: { id: user?.id },
      data: {
        following: {
          push: followUser.id
        }
      }
    });

    if(!following) {
      return NextResponse.json({ message: "You're already following this user"}, {status: 404})
    }

     const follower = await prisma.user.update({
      where: { id: followUser.id },
      data: {
        followers: {
          push: user?.id
        }
      }
    });

    if(!follower) {
      return NextResponse.json({ message: "You're already following this user"}, {status: 404})
    }

    return NextResponse.json({ message: 'User followed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { name: string } }) {
  try {
    const currentUser = await getCurrentUser(); // Get the current user

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { name: currentUser?.name }
    });

    const followUser = await prisma.user.findUnique({
      where: { name: params.name }
    });

    if (!followUser) {
      return NextResponse.json({ error: 'User to unfollow not found' }, { status: 404 });
    }

    if (!user?.following.includes(followUser.id)) {
      return NextResponse.json({ message: "You're not following this user" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        following: {
          set: user.following.filter(id => id !== followUser.id)
        }
      }
    });

    await prisma.user.update({
      where: { id: followUser.id },
      data: {
        followers: {
          set: followUser.followers.filter(id => id !== user.id)
        }
      }
    });

    return NextResponse.json({ message: 'User unfollowed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}