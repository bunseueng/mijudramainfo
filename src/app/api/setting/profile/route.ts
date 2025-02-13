import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const user = await getCurrentUser();
    
        if (!user) {
            return NextResponse.json({ message: "Invalid user" }, { status: 400 });
        }
        
        const body = await request.json();
        
        const { displayName, country, gender, dateOfBirth, biography, profileAvatar } = body;

        // Parse dateOfBirth string into Date object
        const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

        if(profileAvatar) {
            const imgId = user?.public_avatar_id
            if(imgId) {
                await cloudinary.uploader.destroy(imgId)
            }
            
        const uploadRes = await cloudinary.uploader.upload(profileAvatar, {
            upload_preset: "mijudrama_avatar",
            format: "avif",
            secure: true
        })

        if(uploadRes) {
            const updateUserInfo = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                profileAvatar: uploadRes.secure_url,
                public_avatar_id: uploadRes.public_id,
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
    }

        return NextResponse.json({ message: "User Profile updated successfully" }, { status: 200 });
    }
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

        return NextResponse.json({updateUserInfo, message: "User Profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}
