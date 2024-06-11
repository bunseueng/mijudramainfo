import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function PUT(request: Request) {
    try {
        // Fetch the current user
        const currentUser = await getCurrentUser();

        // If the user is not valid, return a 400 error
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid User" }, { status: 400 });
        }

        const {type, listTitle, privacy} = await request.json()

        const randomId = uuidv4();
        const shortId = randomId.split('-')[0]; // Extract the shorter ID

        const list = await prisma.dramaList.create({
            data: {
                listId: shortId,  // Store the shorter ID in the database
                userId: currentUser.id,
                type, 
                listTitle, 
                privacy,
                sortBy: "Release Date Ascending",
            }, include: {user: true}
        })

        if(list) {
            return NextResponse.json({message: "List created successfully"}, {status: 200})
        }

        return NextResponse.json({message: "List created successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({error}, {status: 200})
    }
}
