import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { rating, mood, movieId, emojiImg, episode, status, notes } =
      await req.json();

    const findRating = await prisma.rating.findUnique({
      where: {
        userId: currentUser.id,
        tvId: params.id,
      },
    });

    if (findRating) {
      const updateRating = await prisma.rating.update({
        where: {
          userId: currentUser.id,
          tvId: params.id,
        },
        data: {
          rating: Number.parseFloat(rating),
          mood,
          emojiImg,
          movieId,
          episode,
          status,
          notes,
        },
      });
      return NextResponse.json(
        { updateRating, message: "Rating updated successfully" },
        { status: 200 }
      );
    } else {
      const createRating = await prisma.rating.create({
        data: {
          userId: currentUser.id,
          rating: Number.parseFloat(rating),
          mood,
          emojiImg,
          movieId,
          tvId: params.id,
          episode,
          status,
          notes,
        },
      });

      return NextResponse.json(
        { createRating, message: "Rating created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error in rating operation:", error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { message: "Invalid input: 'ids' must be an array" },
        { status: 400 }
      );
    }
    const ratings = await prisma.rating.findMany({
      where: {
        tvId: {
          in: ids.map((id) => id.toString()),
        },
      },
    });
    // If you need to fetch additional data for each person, you can do it here
    const personsWithAdditionalData = await Promise.all(
      ratings.map(async (rating) => {
        // Example: Fetch additional data for each person
        // Replace this with your actual data fetching logic
        return { ...rating };
      })
    );
    return NextResponse.json(personsWithAdditionalData, { status: 200 });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const deletedRating = await prisma.rating.delete({
      where: {
        userId: currentUser.id,
        tvId: params.id,
      },
    });
    return NextResponse.json(
      { deletedRating, message: "Rating deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
