import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.error("Invalid User");
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const { commentIds, parentIds } = await req.json();

    // Ensure commentIds and parentIds are arrays
    if (!Array.isArray(commentIds) || !Array.isArray(parentIds)) {
      console.error("commentIds and parentIds must be arrays");
      return NextResponse.json({ message: "commentIds and parentIds must be arrays" }, { status: 400 });
    }

    // Fetch all comments for the given post ID
    const allComments = await prisma.comment.findMany({
      where: { postId: params.id },
    });

    let updateResults = [];

    for (let i = 0; i < commentIds.length; i++) {
      const commentId = commentIds[i];

      // Find the comment by commentId
      const repliedComment = allComments.find((com) => com.id === commentId);

      if (!repliedComment) {
        console.error(`Comment not found for commentId: ${commentId}`);
        continue;
      }

      const updatedReplies = repliedComment.replies.map((reply: any) => {
        if (parentIds.includes(reply?.id)) {
          return {
            ...reply,
            notification: "read"
          };
        }
        return reply;
      });

      // Update the comment in the database
      const updatedComment = await prisma.comment.update({
        where: { id: repliedComment.id },
        data: {
          replies: updatedReplies // Set the modified replies array
        },
      });

      updateResults.push(updatedComment);
    }

    return NextResponse.json({ message: "Success", updateResults }, { status: 200 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ message: "Failed to update notification", error }, { status: 500 });
  }
}
