import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
    
        if (!user) {
            return NextResponse.json({ message: "Invalid user" }, { status: 400 });
        }
        
        const body = await request.json();
        
        const { displayName, country, gender, dateOfBirth, biography } = body;

        // Parse dateOfBirth string into Date object
        const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

        const updateUserInfo = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                displayName,
                country,
                gender,
                dateOfBirth: parsedDateOfBirth, // Assign parsed dateOfBirth
                biography
            }
        });

        if (updateUserInfo) {
            return NextResponse.json({ message: "User Profile updated successfully" }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}
