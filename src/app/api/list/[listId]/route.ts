import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { listId: string } }) {
  try {
    // Fetch the current user
    const currentUser = await getCurrentUser();

    // If the user is not valid, return a 400 error
    if (!currentUser) {
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const findList = await prisma.dramaList.findUnique({
      where: {
        listId: params.listId
      }
    });

    if (!findList) {
      return NextResponse.json({ message: "List not found" }, { status: 404 });
    }

    const { movieId, tvId, type, listTitle, privacy, description, thumbnail, love } = await request.json();

    const updatedLovedBy = findList.lovedBy?.includes(currentUser.id)
      ? findList.lovedBy?.filter((id) => id !== currentUser.id)
      : [...(findList.lovedBy || []), currentUser.id];

    const updatedLove = findList.love || 0;

    const list = await prisma.dramaList.update({
      where: {
        listId: findList.listId,
      },
      data: {
        userId: currentUser.id,
        type,
        listTitle,
        privacy,
        description,
        movieId: movieId,
        tvId: tvId,
        thumbnail: thumbnail,
        love: findList.love ? updatedLove - 1 : updatedLove + 1,
        lovedBy: updatedLovedBy
      },
      include: { user: true }
    });

    if (list) {
      return NextResponse.json({ message: "List updated successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "List update failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request, { params, body }: { params: { listId: string }, body: { movieId?: string, tvId?: string } }) {
  try {
    // Fetch the current user
    const currentUser = await getCurrentUser();

    // If the user is not valid, return a 400 error
    if (!currentUser) {
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    // Extract user ID and list ID from the request
    const userId = currentUser.id;
    const listId = params.listId;

    // Check if the list entry exists
    const existingDramaList = await prisma.dramaList.findFirst({
      where: {
        userId,
        listId
      }
    });

    if (!existingDramaList) {
      return NextResponse.json({ message: "List not found" }, { status: 404 });
    }

    let updatedList;

    // Convert movieId and tvId to strings
    const { movieId, tvId } = await request.json();

    // Check if movieId needs to be deleted
    if (movieId) {
      const movieIds = Array.isArray(existingDramaList.movieId) ? existingDramaList.movieId : [];
      updatedList = await prisma.dramaList.update({
        where: {
          listId
        },
        data: {
          movieId: {
            set: movieIds.filter((id: any) => id !== movieId) as any
          }
        }
      });
    }
    // Check if tvId needs to be deleted
    if (tvId) {
      const tvIds = Array.isArray(existingDramaList.tvId) ? existingDramaList.tvId : [];
      updatedList = await prisma.dramaList.update({
        where: {
          listId
        },
        data: {
          tvId: {
            set: tvIds.filter((id: any) => id !== tvId) as any
          }
        }
      });
    }

    if (updatedList) {
      return NextResponse.json({ message: "List updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "List update failed" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
