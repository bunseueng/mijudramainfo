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
      movie_id,
      details,
      cover,
      related_title,
      cast,
      crew,
      services,
      released_information,
      production_information,
      genres_tags,
      photo,
      title,
      description
    } = await req.json();

    const existingMovie = await prisma.movie.findUnique({
      where: { movie_id: params.id }
    });

    const changes: { userId: string; timestamp: string; field: any; oldValue: any; newValue: any; }[] = [];
    let changeCount = 0;
    
    if (cover) {
      const imgId = existingMovie?.public_photo_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
    }

    const uploadRes = await cloudinary.uploader.upload(photo, {
      upload_preset: "mijudrama_movie_photo"
    });

    if (uploadRes) {
      if (existingMovie) {
        // Fetch existing photos from the movie
        const existingPhotos = existingMovie.photo || [];

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
        recordChange('photo', existingMovie.photo, photo);

        // Append new photo to the existing array
        const updatedPhotos = [
            {
                url: uploadRes.url,
                public_photo_id: uploadRes.public_id,
                title,
                description,
              },
              ...existingPhotos,
        ];

        const updateDetails = await prisma.movie.update({
          where: { movie_id: params.id },
          data: {
            details,
            cover,
            related_title,
            cast,
            crew,
            services,
            released_information,
            production_information,
            genres_tags,
            photo: updatedPhotos as any,  // Add the updated photos array here
            changes: {
              push: changes
            },
            changeCount: {
              increment: changeCount,
            },
          },
        });

        await prisma.user.update({
          where: { id: currentUser.id },
          data: {
            points: { increment: 3 }, // Increment by a certain number of points
          },
        });
        return NextResponse.json({ updateDetails, message: "Success" }, { status: 200 });
      } else {
        if (uploadRes) {
          const createDetails = await prisma.movie.create({
            data: {
              userId: currentUser.id,
              movie_id,
              details,
              cover,
              related_title,
              cast,
              crew,
              services,
              released_information,
              production_information,
              genres_tags,
              photo: [{
                url: uploadRes.url,
                public_photo_id: uploadRes.public_id,
                title,
                description,
              }],
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

          await prisma.user.update({
            where: { id: currentUser.id },
            data: {
              points: { increment: 3 }, // Increment by a certain number of points
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
  