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
      // Find the friend record based on friendRequestId
      const friendRecord = await prisma.friend.findFirst({
        where: { friendRequestId: id },
      });

      if (!friendRecord) {
        console.log(`Friend request with id ${id} not found.`);
        continue; // Skip if the record is not found
      }

      // Update the found friend record using its unique id
      await prisma.friend.update({
        where: { id: friendRecord.id },
        data: { notification: "read" },
      });
    }

    return NextResponse.json({ message: "Friend notification updated" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating friend request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
