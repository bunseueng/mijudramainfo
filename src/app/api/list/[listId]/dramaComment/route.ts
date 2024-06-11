import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { listId: string } }) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const { tvId, dramaComment } = await req.json();

        const existingList = await prisma.dramaList.findUnique({
            where: {
                listId: params.listId
            },
        });

        let updatedComments: { tvId: any; comment: any; }[] = [];

        if (existingList === null) {
            // If list doesn't exist, create a new one with the comment
            updatedComments = [{ tvId, comment: dramaComment }];
        } else {
            if (existingList.dramaComment !== null) {
                // Check if the tvId already has a comment
                const existingCommentIndex = existingList.dramaComment.findIndex((comment: any) => comment.tvId === tvId);

                if (existingCommentIndex !== -1) {
                    // Update existing comment
                    updatedComments = existingList.dramaComment.map((comment: any) => {
                        if (comment.tvId === tvId) {
                            return { tvId, comment: dramaComment };
                        }
                        return comment;
                    });
                } else {
                    // Add new comment
                    updatedComments = [...existingList.dramaComment, { tvId, comment: dramaComment }] as any;
                }
            } else {
                // Add new comment if dramaComment is empty 
                updatedComments = [{ tvId, comment: dramaComment }];
            }
        }

        const updatedList = await prisma.dramaList.update({
            where: {
                listId: params.listId
            },
            data: {
                dramaComment: {
                    set: updatedComments
                }
            }
        });

        return NextResponse.json({ updatedList, message: "Successfully added comment to movie/drama" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
