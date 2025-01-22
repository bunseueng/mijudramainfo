import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        // Extract user ID and movie ID from the request
        const userId = currentUser.id;
        const tvId = parseInt(params.id);

        // Check if the user already has a watchlist entry
        const existingWatchlistEntry = await prisma.watchlist.findFirst({
            where: {
                userId,
            },
        });

        let watchlist;
        // If the user has a watchlist entry
        if (existingWatchlistEntry) {
            // Destructure tvId from existing watchlist entry
            const { tvId: tvIds } = existingWatchlistEntry;
            // Check if the tvId is already in the watchlist
            if (!tvIds.map((movie: any) => movie.id).includes(tvId)) {
                // If tvId is not in the watchlist, add it
                const updatedtvIds = [...tvIds, { id: tvId, updatedAt: new Date() }];
                watchlist = await prisma.watchlist.update({
                    where: { id: existingWatchlistEntry.id },
                    data: {
                        tvId: updatedtvIds as any,
                    },
                    include: {
                        user: true,
                    },
                });
            } else {
                // If tvId is already in the watchlist, return the existing watchlist
                watchlist = existingWatchlistEntry;
                return NextResponse.json({message: "Already in the watchlist"}, {status: 404})
            }
        } else {
            // If the user does not have a watchlist entry, create a new one
            watchlist = await prisma.watchlist.create({
                data: {
                    userId,
                    tvId: [{ id: tvId, updatedAt: new Date() }],
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

export async function DELETE(req: Request,props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        // Extract user ID and movie ID from the request
        const userId = currentUser.id;
        const tvId = parseInt(params.id);

        // Check if the user already has a watchlist entry
        const existingWatchlistEntry = await prisma.watchlist.findFirst({
            where: {
                userId,
            },
        });

        if (existingWatchlistEntry) {
            const { tvId: tvIds } = existingWatchlistEntry;
            // Check if the tvId is already in the watchlist
            const updatedtvIds = tvIds.filter((movie: any) => movie.id !== tvId);
            if (updatedtvIds.length < tvIds.length) {
                // If tvId is in the watchlist, remove it
                const updatedWatchlist = await prisma.watchlist.update({
                    where: { id: existingWatchlistEntry.id },
                    data: { tvId: updatedtvIds as any },
                    include: {
                        user: true,
                    },
                });
                return NextResponse.json({ message: "Drama removed from watchlist", watchlist: updatedWatchlist }, { status: 200 });
            }
        }

        return NextResponse.json({ message: "Drama not found in watchlist" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
