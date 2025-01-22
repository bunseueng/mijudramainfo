import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: {params : Promise<{name : string}>}) {
    const params = await props.params;
    try {
        const currentUser = await getCurrentUser()

        if(!currentUser) {
            return NextResponse.json({message: "Invalid User"}, {status: 404})
        }

        const findFeeds = await prisma.feeds.findUnique({
            where: {
                username: params.name,
            }
        })

        if (!findFeeds) {
            return NextResponse.json({ message: "Feeds not found" }, { status: 404 });
          }

        const updatedLikedBy = findFeeds?.likeBy?.includes(currentUser.id)
        ? findFeeds.likeBy?.filter((id) => id !== currentUser.id)
        : [...(findFeeds.likeBy || []), currentUser.id];

        const updatedLike = findFeeds.like || 0;

        const creatingFeeds = await prisma.feeds.update({
            where: {
                id: findFeeds?.id,
            },
            data: {
                like: findFeeds.like ? updatedLike - 1 : updatedLike + 1,
                likeBy: updatedLikedBy
            }
        })
        return NextResponse.json({creatingFeeds, message: "Success",}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error occurred"}, {status: 500})
    }
}