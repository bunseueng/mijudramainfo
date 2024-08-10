import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { currentUserProps } from "@/helper/type";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface PopularityItem {
  itemId: string;
  starCount: number;
}

// Type guard to check if an object is a valid PopularityItem
const isPopularityItem = (item: any): item is PopularityItem => {
  return (
    item &&
    typeof item.itemId === "string" &&
    typeof item.starCount === "number"
  );
};

// Type guard to check if an array contains only PopularityItems
const isPopularityItemArray = (arr: any): arr is PopularityItem[] => {
  return Array.isArray(arr) && arr.every(isPopularityItem);
};

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    const { popularity, calculateTotalCoins } = await req.json();

    const findPerson = await prisma.person.findUnique({
      where: {
        personId: params.id,
      },
    });

    if (calculateTotalCoins > (currentUser?.coin ?? 0)) {
      return NextResponse.json({ message: "You don't have enough coin" }, { status: 404 });
    }

    let updatingPopularity;
    if (findPerson) {
      const existingPopularity: any = findPerson.popularity || [];
      const validExistingPopularity = isPopularityItemArray(existingPopularity)
        ? existingPopularity
        : [];

      // Merge new popularity with existing popularity
      const updatedPopularity: PopularityItem[] = [...validExistingPopularity];

      for (const newPop of popularity) {
        const existingPopIndex = updatedPopularity.findIndex(
          (pop) => pop.itemId === newPop.itemId
        );
        if (existingPopIndex !== -1) {
          // Update the existing item
          updatedPopularity[existingPopIndex].starCount += newPop.starCount;
        } else {
          // Add the new item
          updatedPopularity.push(newPop);
        }
      }

      updatingPopularity = await prisma.person.update({
        where: {
          personId: params.id,
        },
        data: {
          popularity: updatedPopularity as any,
          // Keep existing sentBy and add the new ID
          sentBy: {
            push: currentUser?.id,
          },
        },
      });
    } else {
      updatingPopularity = await prisma.person.create({
        data: {
          personId: params.id,
          popularity,
          sentBy: [currentUser?.id]
        },
      });
    }

    if (updatingPopularity) {
      await prisma.user.update({
        where: {
          id: currentUser?.id,
        },
        data: {
          coin: { decrement: calculateTotalCoins },
        },
      });

      const existingUserPopularitySent: any[] = currentUser.popularitySent || [];

      // Check if there's already an entry for this person
      const personIndex = existingUserPopularitySent.findIndex((popArray) =>
        popArray.some((popItem: PopularityItem) => popItem.itemId === params.id)
      );

      if (personIndex !== -1) {
        // Update the existing person's popularity array
        for (const newPop of popularity) {
          const existingPopIndex = existingUserPopularitySent[personIndex].findIndex(
            (pop: PopularityItem) => pop.itemId === newPop.itemId
          );
          if (existingPopIndex !== -1) {
            // Update the existing item
            existingUserPopularitySent[personIndex][existingPopIndex].starCount += newPop.starCount;
          } else {
            // Add the new item
            existingUserPopularitySent[personIndex].push(newPop);
          }
        }
      } else {
        // Add a new array for the new person
        existingUserPopularitySent.push(popularity);
      }

      await prisma.user.update({
        where: {
          id: currentUser?.id,
        },
        data: {
          popularitySent: existingUserPopularitySent as any,
        },
      });
    }

    return NextResponse.json(
      { updatingPopularity, message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}


let currentIndex = 0;
export async function GET() {
  try {
    // Fetch all people from the database
    const people = await prisma.person.findMany({
      orderBy: { id: 'asc' }, // Ensure ordering
    });

    // Check if there are no items
    if (people.length === 0) {
      return NextResponse.json({ message: 'No items found' }, { status: 404 });
    }

    // Get the current item
    const item = people[currentIndex];
    
    // Update index, reset if it exceeds length
    currentIndex = (currentIndex + 1) % people.length;

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ message: 'Error fetching next item' }, { status: 500 });
  }
}
