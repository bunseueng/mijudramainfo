import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        // Extract user ID and movie ID from the request
        const userId = currentUser.id;
        const favoriteIds = parseInt(params.id);

        // Check if the user already has a watchlist entry
        const existingWatchlistEntry = await prisma.watchlist.findFirst({
            where: {
                userId,
            },
        });

        let watchlist;
        // If the user has a watchlist entry
        if (existingWatchlistEntry) {
            // Destructure movieId from existing watchlist entry
            const { favoriteIds: favoriteId } = existingWatchlistEntry;
            // Check if the movieId is already in the watchlist
            if (!favoriteId.map((favorite: any) => favorite.id).includes(favoriteIds)) {
                // If movieId is not in the watchlist, add it
                const updatedFavoriteIds = [...favoriteId, { id: favoriteIds, updatedAt: new Date() }];
                watchlist = await prisma.watchlist.update({
                    where: { id: existingWatchlistEntry.id },
                    data: {
                        favoriteIds: updatedFavoriteIds as any,
                    },
                    include: {
                        user: true,
                    },
                });
            } else {
                // If movieId is already in the watchlist, return the existing watchlist
                watchlist = existingWatchlistEntry;
                return NextResponse.json({message: "Already in the watchlist"}, {status: 404})
            }
        } else {
            // If the user does not have a watchlist entry, create a new one
            watchlist = await prisma.watchlist.create({
                data: {
                    userId,
                    favoriteIds: [{ id: favoriteIds, updatedAt: new Date() }],
                },
                include: {
                    user: true,
                },
            });
        }

        // Return the watchlist entry
        return NextResponse.json({ watchlist }, { status: 200 });
    } catch (error) {
        // Handle any errors and return a 500 status code
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        // Extract user ID and movie ID from the request
        const userId = currentUser.id;
        const favoriteIds = parseInt(params.id);

        // Check if the user already has a watchlist entry
        const existingWatchlistEntry = await prisma.watchlist.findFirst({
            where: {
                userId,
            },
        });

        if (existingWatchlistEntry) {
            const { favoriteIds: favoriteId } = existingWatchlistEntry;
            // Check if the movieId is already in the watchlist
            const updatedMovieIds = favoriteId.filter((movie: any) => movie?.id !== favoriteIds);
            if (updatedMovieIds.length < favoriteId.length) {
                // If movieId is in the watchlist, remove it
                const updatedWatchlist = await prisma.watchlist.update({
                    where: { id: existingWatchlistEntry.id },
                    data: { favoriteIds: updatedMovieIds as any },
                    include: {
                        user: true,
                    },
                });
                return NextResponse.json({ message: "Movie removed from watchlist", watchlist: updatedWatchlist }, { status: 200 });
            }
        }

        return NextResponse.json({ message: "Movie not found in watchlist" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
