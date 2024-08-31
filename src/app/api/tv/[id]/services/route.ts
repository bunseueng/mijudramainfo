import { getCurrentUser } from "@/app/actions/getCurrentUser";
import cloudinary from "@/lib/cloundinary";
import prisma from "@/lib/db";
import { JsonValue } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

async function uploadAndMergeServices(existingServices:any, newServices:any) {
  return await Promise.all(newServices.map(async (service:any, index: number) => {
    if (service?.service) {
      const imagePath = service?.service
      try { 
        const uploadRes = await cloudinary.uploader.upload(imagePath, {
          upload_preset: "mijudrama_edit_services",
          resource_type: "image"
        });

        if(service.service_url) {
          const imgId = service?.public_id
          if(imgId) {
              await cloudinary.uploader.destroy(imgId)
          }
        }

        if (uploadRes) {
          service.service_url = uploadRes?.url;
          service.public_id = uploadRes?.public_id;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    const randomId = uuidv4();
    const shortId = randomId.split('-')[0];
    // Merge existing properties if they are not being updated
    const existingService = existingServices[index] || {};
    return {
      ...existingService,
      ...service,
      id: shortId,
      service_url: service?.service_url || existingService?.service_url,
      public_id: service?.public_id || existingService?.public_id,
      service_name: service?.service_name || existingService?.service_name,
      service: service?.service || existingService?.service,
    };
  }));
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.error("Invalid User");
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const {
      tv_id,
      details,
      related_title,
      cast,
      crew,
      services,
      released_information,
      production_information,
      genres_tags,
    } = await req.json();

    const existingDrama = await prisma.drama.findUnique({
      where: { tv_id: params.id }
    });

    const changes = [] as any[];
    let changeCount = 0;

    const updatedServices = existingDrama
      ? await uploadAndMergeServices(existingDrama?.services, services)
      : await uploadAndMergeServices([], services);

    if (existingDrama) {
      // Function to compare and record changes
      const recordChange = (field: string, oldValue: JsonValue[], newValue: JsonValue[]) => {
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
      recordChange('services', existingDrama?.services, updatedServices);

      // Update the drama in the database
      const updateDetails = await prisma.drama.update({
        where: { tv_id: params.id },
        data: {
          details,
          related_title,
          cast,
          crew,
          services: updatedServices,
          released_information,
          production_information,
          genres_tags,
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
      // Handle creation of new drama
      const createDetails = await prisma.drama.create({
        data: {
          userId: currentUser.id,
          tv_id,
          details,
          related_title,
          cast,
          crew,
          services: updatedServices,
          released_information,
          production_information,
          genres_tags,
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.error("Invalid User");
      return NextResponse.json({ message: "Invalid User" }, { status: 400 });
    }

    const {
      tv_id,
      details,
      related_title,
      cast,
      crew,
      services,
      released_information,
      production_information,
      genres_tags,
    } = await req.json();

    const existingDrama = await prisma.drama.findUnique({
      where: { tv_id: params.id }
    });

    const changes = [] as any[];
    let changeCount = 0;

    const updatedServices = existingDrama
      ? await uploadAndMergeServices(existingDrama?.services, services)
      : await uploadAndMergeServices([], services);

    if (existingDrama) {
      // Function to compare and record changes
      const recordChange = (field: string, oldValue: JsonValue[], newValue: JsonValue[]) => {
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
      recordChange('services', existingDrama?.services, updatedServices);

      // Update the drama in the database
      const updateDetails = await prisma.drama.update({
        where: { tv_id: params.id },
        data: {
          details,
          related_title,
          cast,
          crew,
          services: updatedServices,
          released_information,
          production_information,
          genres_tags,
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
      // Handle creation of new drama
      const createDetails = await prisma.drama.create({
        data: {
          userId: currentUser.id,
          tv_id,
          details,
          related_title,
          cast,
          crew,
          services: updatedServices,
          released_information,
          production_information,
          genres_tags,
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

