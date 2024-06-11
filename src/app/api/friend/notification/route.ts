import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const user = await getCurrentUser(); // Get the current user
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        let { friendRequestId } = await req.json();
        
        // Ensure friendRequestId is an array
        if (!Array.isArray(friendRequestId)) {
            friendRequestId = [friendRequestId];
        }

        // Iterate over each friendRequestId
        for (const id of friendRequestId) {
            const updatedFriendRequest = await prisma.friend.update({
                where: { friendRequestId: id as any }, // Update based on the friendRequestId
                data: { notification: "read" },
            });
        }

        return NextResponse.json({ message: "Friend accepted/rejected" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
