import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser();
    
        if (!user) {
            return NextResponse.json({ message: "Invalid user" }, { status: 400 });
        }
        
        const body = await request.json();
        
        const { profileAvatar } = body;
        if(profileAvatar) {
            const imgId = user?.public_id
            if(imgId) {
                await cloudinary.uploader.destroy(imgId)
            }
        }

        const uploadRes = await cloudinary.uploader.upload(profileAvatar, {
            upload_preset: "mijudrama_avatar"
        })

        if(uploadRes) {
            const updateUserInfo = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    profileAvatar: uploadRes.url,
                    public_id: uploadRes.public_id
                }
            });

            if (updateUserInfo) {
                return NextResponse.json({ updateUserInfo }, { status: 200 });
            }
        }
        return NextResponse.json({message: "Profile Avatar added successfully" }, { status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}