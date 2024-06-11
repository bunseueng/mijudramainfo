import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { rating, mood, movieId, tvId, emojiImg, episode, status, notes } = await req.json();

        const findRating = await prisma.rating.findUnique({
            where: {
                tvId: params?.id,
                userId: currentUser?.id,
            }
        });

        if (findRating) {
            const updateRating = await prisma.rating.update({
                where: {
                    tvId: params?.id
                },
                data: {
                    rating: parseFloat(rating),
                    mood: mood,
                    emojiImg: emojiImg,
                    movieId: movieId,
                    tvId: tvId,
                    episode: episode,
                    status: status, 
                    notes: notes
                }
            })
            return NextResponse.json({ updateRating, message: "Rating updated successfully" }, { status: 200 });
        } else {
            const createRating = await prisma.rating.create({
                data: {
                    userId: currentUser.id,
                    rating: parseFloat(rating),
                    mood: mood,
                    emojiImg: emojiImg,
                    movieId: movieId,
                    tvId: tvId,
                    episode: "",
                    status: "", 
                    notes: "",
                }
            });

            return NextResponse.json({ createRating, message: "Rating created successfully" }, { status: 200 });
        }
    } catch (error) {
        // Check if the error is PrismaClientValidationError
        if (error instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        } else {
            return NextResponse.json({ error }, { status: 500 });
        }
    }
}


export async function GET(req: Request, { params }: { params: { tvId: string } }) {
    try {
    const ratings = await prisma.rating.findMany({
      where: { tvId: params.tvId },
    });
    return NextResponse.json({ ratings });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const ratings = await prisma.rating.delete({
            where: { 
                tvId: params.id, 
                userId: currentUser?.id
            },
        });
    return NextResponse.json({ ratings }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}