import { getCurrentUser } from "@/app/actions/getCurrentUser"
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const params = await props.params;
    const { rating, mood, movieId, emojiImg, episode, status, notes } = await req.json()

    const findRating = await prisma.rating.findUnique({
      where: {
          userId: currentUser.id,
          tvId: params.id,
      },
    })

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
      })
      return NextResponse.json({ updateRating, message: "Rating updated successfully" }, { status: 200 })
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
      })

      return NextResponse.json({ createRating, message: "Rating created successfully" }, { status: 201 })
    }
  } catch (error) {
    console.error("Error in rating operation:", error)
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ message: "Invalid data provided" }, { status: 400 })
    } else {
      return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
  }
}

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const ratings = await prisma.rating.findMany({
      where: { tvId: params.id },
    })
    return NextResponse.json({ ratings })
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const params = await props.params;
    const deletedRating = await prisma.rating.delete({
      where: {
          userId: currentUser.id,
          tvId: params.id,
      },
    })
    return NextResponse.json({ deletedRating, message: "Rating deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting rating:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

