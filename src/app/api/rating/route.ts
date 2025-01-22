import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { rating, mood, movieId, tvId, emojiImg, episode, status, notes } = await req.json();

        const findRating = await prisma.rating.findUnique({
            where: {
                    userId: currentUser.id,
                    tvId: tvId,
            }
        });

        if (findRating) {
            const updateRating = await prisma.rating.update({
                where: {
                        userId: currentUser.id,
                        tvId: tvId
                },
                data: {
                    rating: parseFloat(rating),
                    mood,
                    emojiImg,
                    movieId,
                    episode,
                    status, 
                    notes
                }
            });
            return NextResponse.json({ updateRating, message: "Rating updated successfully" }, { status: 200 });
        } else {
            const createRating = await prisma.rating.create({
                data: {
                    userId: currentUser.id,
                    rating: parseFloat(rating),
                    mood,
                    emojiImg,
                    movieId,
                    tvId,
                    episode,
                    status, 
                    notes,
                }
            });

            return NextResponse.json({ createRating, message: "Rating created successfully" }, { status: 201 });
        }
    } catch (error) {
        console.error('Error in rating operation:', error);
        if (error instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
        } else {
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }
}

export async function DELETE(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { tvId } = await req.json();

        const deletedRating = await prisma.rating.delete({
            where: { 
                    userId: currentUser.id,
                    tvId: tvId
            },
        });
        return NextResponse.json({ deletedRating, message: "Rating deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting rating:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
