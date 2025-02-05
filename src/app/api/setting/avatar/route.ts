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

        if (profileAvatar) {
            const imgId = user?.public_avatar_id;
            if (imgId) {
                await cloudinary.uploader.destroy(imgId);
            }
        }

        const uploadRes = await cloudinary.uploader.upload(profileAvatar, {
            upload_preset: "mijudrama_avatar",
            format: "avif",
        });

        if (uploadRes) {
            // Update user's avatar in the user table
            const updateUserInfo = await prisma.user.update({
                where: { id: user.id },
                data: {
                    profileAvatar: uploadRes.url,
                    public_avatar_id: uploadRes.public_id
                }
            });

            // Fetch existing userInfo for tvReview and movieReview
            const existingTvReview = await prisma.tvReview.findUnique({
                where: { userId: user.id }
            });
            const existingMovieReview = await prisma.movieReview.findUnique({
                where: { userId: user.id }
            });

            if (existingTvReview && existingMovieReview) {
                // Ensure userInfo is an object before spreading
                const updatingTvReview = await prisma.tvReview.update({
                    where: { userId: user.id },
                    data: {
                        userInfo: {
                            ...(typeof existingTvReview.userInfo === 'object' && existingTvReview.userInfo !== null ? existingTvReview.userInfo : {}),
                            profileAvatar: uploadRes.url
                        }
                    }
                });

                const updatingMovieReview = await prisma.movieReview.update({
                    where: { userId: user.id },
                    data: {
                        userInfo: {
                            ...(typeof existingMovieReview.userInfo === 'object' && existingMovieReview.userInfo !== null ? existingMovieReview.userInfo : {}),
                            profileAvatar: uploadRes.url
                        }
                    }
                });

                return NextResponse.json({ updatingTvReview, updatingMovieReview,updateUserInfo, message: "Success" }, { status: 200 });
            }
        }

        return NextResponse.json({ message: "Profile Avatar added successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}
