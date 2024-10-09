import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { findCommentById } from "@/app/actions/findCommentById";


export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            console.error("Invalid User");
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { message, parentId, userId, repliedUserId, spoiler } = await req.json();
        
        if (!message.trim()) {
            console.error("Message cannot be empty");
            return NextResponse.json({ message: "Message cannot be empty" }, { status: 404 });
        }

        if (parentId) {
            // Fetch all comments to locate the parent comment
            const allComments = await prisma.comment.findMany({
                where: { postId: params.id },
            });

            const parentComment = await findCommentById(parentId, allComments);

            if (!parentComment) {
                console.error("Parent comment not found for parentId:", parentId);
                return NextResponse.json({ message: "Parent comment not found" }, { status: 403 });
            }

            const newReplyId = new ObjectId().toString();
            const updatedParentComment = await prisma.comment.update({
                where: { id: parentComment.parentId || parentComment.id },
                data: {
                    replies: {
                        push: {
                            id: newReplyId,
                            parentId: parentComment.id,
                            message,
                            postId: params.id,
                            userId: parentComment.repliedUserId,
                            repliedUserId,
                            createdAt: new Date(),
                            love: 0,
                            notification: "unread",
                            spoiler
                        },
                    },
                },
            });

            if (!updatedParentComment) {
                return NextResponse.json({ message: "Failed to update parent comment with reply" }, { status: 403 });
            }

            // Modify the first reply's userId
            const modifiedReplies = updatedParentComment.replies.map((reply, index) => {
                if (index === 0) {
                    // Clone the reply object to avoid modifying the original
                    const modifiedReply = { ...reply as any};
                    // Update the userId of the first reply
                    modifiedReply.userId = parentComment.userId;
                    return modifiedReply;
                }
                return reply;
            });

            // Save the modified replies back to the database
            await prisma.comment.update({
                where: { id: parentComment.parentId || parentComment.id },
                data: {
                    replies: modifiedReplies,
                },
            });


            return NextResponse.json({ message: "Reply created successfully and first reply's userId modified", updatedParentComment }, { status: 200 });
        } else {
            const creatingComment = await prisma.comment.create({
                data: {
                    message,
                    userId,
                    repliedUserId: userId,
                    postId: params.id,
                    spoiler,
                    type: "movie"
                },
            });
            console.log("Created new comment:", creatingComment);

            if (!creatingComment) {
                console.error("Failed to create comment");
                return NextResponse.json({ message: "Failed to create comment" }, { status: 403 });
            }

            return NextResponse.json({ message: "Comment created successfully", creatingComment }, { status: 200 });
        }
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ message: "Failed to create comment", error }, { status: 500 });
    }
}

async function updateNestedReply(commentId: string, comments: any[], updatedData: any): Promise<any | null> {

    for (const comment of comments) {
        if (comment.replies) {
            const replyIndex = comment.replies.findIndex((reply: any) => reply.id === commentId);
            if (replyIndex !== -1) {
                // Update the specific reply
                comment.replies[replyIndex] = {
                    ...comment.replies[replyIndex],
                    ...updatedData,
                };

                // Update the parent comment in the database
                const updatedParentComment = await prisma.comment.update({
                    where: { id: comment.id },
                    data: {
                        replies: comment.replies,
                    },
                });
                return updatedParentComment;
            } else {
                const nestedUpdated = await updateNestedReply(commentId, comment.replies, updatedData);
                if (nestedUpdated) {
                    return nestedUpdated;
                }
            }
        }
    }
    return null;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            console.error("Invalid User");
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { commentId } = await req.json();

        // Fetch all comments to locate the comment or reply
        const allComments = await prisma.comment.findMany({
            where: { postId: params.id },
        });

        const targetComment = await findCommentById(commentId, allComments);

        if (!targetComment) {
            console.error("Comment not found for commentId:", commentId);
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // Ensure lovedBy is an array
        const lovedBy = targetComment.lovedBy || [];
        const hasLiked = lovedBy.includes(currentUser.id);

        // Update the likes and lovedBy fields
        const updatedLovedBy = hasLiked
            ? lovedBy.filter((id: any) => id !== currentUser.id)
            : [...lovedBy, currentUser.id];

        const updatedLove = hasLiked ? targetComment.love - 1 : targetComment.love + 1;

        const updatedData = {
            love: updatedLove,
            lovedBy: updatedLovedBy,
        };

        // Check if the comment is a reply
        if (targetComment.parentId) {
            const updatedParentComment = await updateNestedReply(commentId, allComments, updatedData);

            if (updatedParentComment) {
                return NextResponse.json({ message: "Success", updatedParentComment }, { status: 200 });
            } else {
                console.error("Reply not found for commentId:", commentId);
                return NextResponse.json({ message: "Reply not found" }, { status: 404 });
            }
        } else {
            // Update the parent comment itself
            const updatedComment = await prisma.comment.update({
                where: { id: targetComment.id },
                data: updatedData,
            });

            return NextResponse.json({ message: "Success", updatedComment }, { status: 200 });
        }
    } catch (error) {
        console.error("Error liking comment:", error);
        return NextResponse.json({ message: "Failed to like comment", error }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            console.error("Invalid User");
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { commentId, message, spoiler } = await req.json();

        // Fetch all comments related to the post
        const allComments = await prisma.comment.findMany({
            where: { postId: params.id },
        });

        // Find the target comment (could be a main comment or a reply)
        const targetComment = await findCommentById(commentId, allComments);

        if (!targetComment) {
            console.error("Comment not found for commentId:", commentId);
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // Check if the current user is the owner of the comment (whether it's a main comment or reply)
        if (currentUser.id !== targetComment.repliedUserId) {
            return NextResponse.json({ message: "You are not the owner of this comment" }, { status: 405 });
        }

        // If the comment is a reply (has a parentId), update the specific reply in the parent's replies array
        if (targetComment.parentId) {
            const updatedParentComment = await updateNestedReply(
                commentId, 
                allComments, 
                { message, spoiler }
            );

            if (updatedParentComment) {
                return NextResponse.json({ message: "Reply updated successfully", updatedParentComment }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Failed to update the reply", status: 500 });
            }
        } else {
            // Update the main comment itself
            const updatingComment = await prisma.comment.update({
                where: { id: targetComment.id },
                data: {
                    message,
                    spoiler,
                },
            });

            return NextResponse.json({ message: "Main comment updated successfully", updatingComment }, { status: 200 });
        }
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ message: "Failed to update comment", error }, { status: 500 });
    }
}

async function deleteNestedReply(commentId: string, comments: any[]): Promise<boolean> {
    for (const comment of comments) {
        if (comment.replies) {
            const replyIndex = comment.replies.findIndex((reply: any) => reply.id === commentId);
            if (replyIndex !== -1) {
                comment.replies.splice(replyIndex, 1);

                // Update the parent comment in the database
                await prisma.comment.update({
                    where: { id: comment.id },
                    data: {
                        replies: comment.replies,
                    },
                });
                return true;
            } else {
                const nestedDeleted = await deleteNestedReply(commentId, comment.replies);
                if (nestedDeleted) {
                    return true;
                }
            }
        }
    }
    return false;
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            console.error("Invalid User");
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { commentId } = await req.json();

        // Fetch all comments to locate the comment or reply
        const allComments = await prisma.comment.findMany({
            where: { postId: params.id },
        });

        const targetComment = await findCommentById(commentId, allComments);

        if(currentUser?.id !== targetComment.repliedUserId) {
            return NextResponse.json({message: "You're not owner of this comment"}, {status: 405})
        }

        console.log(currentUser?.id !== targetComment.repliedUserId)

        if (!targetComment) {
            console.error("Comment not found for commentId:", commentId);
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // Check if the comment is a reply
        if (targetComment.parentId) {
            const replyDeleted = await deleteNestedReply(commentId, allComments);

            if (replyDeleted) {
                return NextResponse.json({ message: "Reply deleted successfully" }, { status: 200 });
            } else {
                console.error("Reply not found for commentId:", commentId);
                return NextResponse.json({ message: "Reply not found" }, { status: 404 });
            }
        } else {
            // Delete the parent comment itself
            await prisma.comment.delete({
                where: { id: targetComment.id },
            });

            return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ message: "Failed to delete comment", error }, { status: 500 });
    }
}