import { getCurrentUser } from "@/app/actions/getCurrentUser";
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
      external_links
    } = await req.json();

    const existingPerson = await prisma.person.findUnique({
      where: { personId: params.id }
    });

    const changes: { userId: string; timestamp: string; field: any; oldValue: any; newValue: any; }[] = [];
    let changeCount = 0;

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
      recordChange('external_links', existingPerson.external_links, external_links);
      const initialChangeCount = existingPerson.changeCount || 0;
      const updateDetails = await prisma.person.update({
        where: { personId: params.id },
        data: {
          details,
          cover,
          cast,
          crew,
          external_links,
          changes: {
            push: changes
          },
          changeCount: {
            set: initialChangeCount + changeCount,
          },
        },
      });

      return NextResponse.json({ updateDetails, message: "Success" }, { status: 200 });
    } else {
      const createDetails = await prisma.person.create({
        data: {
          personId,
          details,
          cover,
          cast,
          crew,
          external_links,
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
