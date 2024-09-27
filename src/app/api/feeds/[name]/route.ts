import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { name: string } }) {
    try {
      const currentUser = await getCurrentUser();
  
      if (!currentUser) {
        return NextResponse.json({ message: "Invalid User" }, { status: 404 });
      }
  
      const { postText, imagePreview, linkPreview, isSpoiler, storedData } = await req.json();
  
      const findFeeds = await prisma.feeds.findUnique({
        where: {
          username: params.name,
        },
      });
  
      if (!findFeeds) {
        return NextResponse.json({ message: "Feeds not found" }, { status: 404 });
      }
  
      // Check if image is provided
      let uploadRes = null;
      if (imagePreview) {
        const imgId = findFeeds?.public_id;
        if (imgId) {
          await cloudinary.uploader.destroy(imgId);
        }
  
        uploadRes = await cloudinary.uploader.upload(imagePreview, {
          upload_preset: "profile_feeds",
        });
      }
  
      // Create the post, adding the image URL only if the upload succeeded
      const creatingFeeds = await prisma.feeds.create({
        data: {
          userId: currentUser.id,
          username: params.name,
          content: postText,
          link: linkPreview,
          image: uploadRes?.secure_url || null, // Add image URL if it exists, otherwise null
          public_id: uploadRes?.public_id || null, // Add Cloudinary public_id if available
          spoiler: isSpoiler,
          tag: storedData,
        },
      });
  
      return NextResponse.json({ creatingFeeds, message: "Success" }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Error occurred" }, { status: 500 });
    }
  }
  

export async function PATCH(req: Request, {params} : {params : {name : string}}) {
    try {
        const currentUser = await getCurrentUser()

        if(!currentUser) {
            return NextResponse.json({message: "Invalid User"}, {status: 404})
        }

        const {
            editContent,
            currentFeed,
            item,
            isSpoiler,} = await req.json()

        const findFeeds = await prisma.feeds.findUnique({
            where: {
                username: params.name,
            }
        })
        const creatingFeeds = await prisma.feeds.update({
            where: {
                id: findFeeds?.id,
            },
            data: {
                content: editContent ? editContent : currentFeed,
                spoiler: isSpoiler,
                tag: item,
            }
        })
        return NextResponse.json({creatingFeeds, message: "Success",}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error occurred"}, {status: 500})
    }
}

export async function DELETE(req: Request, {params} : {params : {name : string}}) {
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
        const creatingFeeds = await prisma.feeds.delete({
            where: {
                id: findFeeds?.id,
            },
        })
        return NextResponse.json({creatingFeeds, message: "Success",}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error occurred"}, {status: 500})
    }
}