import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.error("Invalid User");
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const {
      personId,
      details,
      cover,
      cast,
      crew,
    } = await req.json();

    const existingPerson = await prisma.person.findUnique({
      where: { personId: params.id }
    });

    const changes: { userId: string; timestamp: string; field: any; oldValue: any; newValue: any; }[] = [];
    let changeCount = 0;
    
    if(cover) {
        const imgId = existingPerson?.public_cover_id
        if(imgId) {
            await cloudinary.uploader.destroy(imgId)
        }
    }

    const uploadRes = await cloudinary.uploader.upload(cover, {
        upload_preset: "person_cover"
    })

    if(uploadRes) {
        if (existingPerson) {
            // Function to compare and record changes
            const recordChange = (field: string, oldValue: string | Prisma.JsonValue[], newValue: any) => {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                changes.push({
                  userId: currentUser.id,
                  timestamp: new Date().toISOString(),
                  field,
                  oldValue,
                  newValue,
                });
                changeCount++;
              }
            };
      
            // Check and record changes for all fields
            recordChange('cover', existingPerson.cover as string, cover);
      
            const updateDetails = await prisma.person.update({
              where: { personId: params.id },
              data: {
                details,
                cover: uploadRes.url,
                public_cover_id: uploadRes.public_id,
                cast,
                crew,
                changes: {
                  push: changes
                },
                changeCount: {
                  increment: changeCount,
                },
              },
            });
      
            return NextResponse.json({ updateDetails, message: "Success" }, { status: 200 });
          } else {
              if(uploadRes) {
                  const createDetails = await prisma.person.create({
                      data: {
                      personId,
                      details,
                      cover: uploadRes.url,
                      public_cover_id: uploadRes.public_id,
                      cast,
                      crew,
                      changes: [
                          {
                          userId: currentUser.id,
                          timestamp: new Date().toISOString(),
                          field: "initial",
                          oldValue: null,
                          newValue: "created",
                          }
                      ],
                      changeCount: 1,
                      },
                  });
      
                  return NextResponse.json({ createDetails, message: "Success" }, { status: 200 });
              }
          }
    }

    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
