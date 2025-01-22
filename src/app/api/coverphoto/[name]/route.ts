import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, props: {params: Promise<{name: string}>}) {
    const params = await props.params;
    try {
        const currentUser = await getCurrentUser();
        
        if(!currentUser) {
            return NextResponse.json({message: "Invalid user"}, {status: 400})
        }
        
        const body = await request.json()

        const {coverPhoto} = body

        const user = await prisma.user.findUnique({
            where: { name: params.name}
        })

        if(coverPhoto) {
            const imgId = user?.public_cover_id
            if(imgId) {
                await cloudinary.uploader.destroy(imgId)
            }
        }

        const uploadRes = await cloudinary.uploader.upload(coverPhoto, {
            upload_preset: "mijudrama_cover"
        })

        if(uploadRes) {
            const uploadCover = await prisma.user.update({
                where: {
                    name: user?.name
                },
                data: {
                    coverPhoto: uploadRes.url,
                    public_cover_id: uploadRes.public_id,
                }
            })
            return NextResponse.json(uploadCover, {status:200})
        }
        return NextResponse.json({message: "Cover Photo uploaded successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Failed to upload"}, {status: 500})
    }
}