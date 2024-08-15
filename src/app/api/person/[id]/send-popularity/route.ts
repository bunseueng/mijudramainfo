import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { currentUserProps } from "@/helper/type";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface PopularityItem {
  itemId: string;
  starCount: number;
  actorName: string
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

      // Ensure unique sentBy IDs
      const uniqueSentBy = Array.from(new Set([...findPerson.sentBy, currentUser.id]));

      updatingPopularity = await prisma.person.update({
        where: {
          personId: params.id,
        },
        data: {
          popularity: updatedPopularity as any,
          sentBy: uniqueSentBy as any,  // Cast to avoid type error
        },
      });
    } else {
      updatingPopularity = await prisma.person.create({
        data: {
          personId: params.id,
          popularity,
          sentBy: [currentUser?.id],
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
      // Merge existing and new popularity arrays
      const actorMap = new Map<string, PopularityItem[]>();
      // Populate actorMap with existing data
      for (const popArray of existingUserPopularitySent) {
        for (const item of popArray) {
          const { actorName } = item;
          if (!actorMap.has(actorName)) {
            actorMap.set(actorName, []);
          }
          actorMap.get(actorName)!.push(item);
        }
      }

      // Add/update new data
      for (const newPop of popularity) {
        const { actorName } = newPop;
        if (!actorMap.has(actorName)) {
          actorMap.set(actorName, []);
        }
        const existingArray = actorMap.get(actorName)!;
        const existingPopIndex = existingArray.findIndex(
          (pop: PopularityItem) => pop.itemId === newPop.itemId
        );
        if (existingPopIndex !== -1) {
          // Update the existing item
          existingArray[existingPopIndex].starCount += newPop.starCount;
        } else {
          // Add the new item
          existingArray.push(newPop);
        }
      }

      // Convert actorMap to the desired structure
      const updatedPopularitySent = Array.from(actorMap.values());
      // Calculate total starCount for each actor and prepare the totalPopularitySent array
      const updatedTotalPopularitySent = Array.from(actorMap.entries()).map(
        ([actorName, popularityItems]) => {
          const totalStarCount = popularityItems.reduce((total, item) => {
            return total + item.starCount;
          }, 0);

          return {
            personId: params.id,
            actorName,
            totalPopularity: totalStarCount,
          };
        }
      );

      await prisma.user.update({
        where: {
          id: currentUser?.id,
        },
        data: {
          popularitySent: updatedPopularitySent as any,
          totalPopularitySent: updatedTotalPopularitySent
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
    // Fetch all people from the database who have non-empty popularity and sentBy arrays
    const people = await prisma.person.findMany({
      where: {
        AND: [
          {
            popularity: {
              isEmpty: false, // Ensure the popularity array is not empty
            },
          },
          {
            sentBy: {
              isEmpty: false, // Ensure the sentBy array is not empty
            },
          },
        ],
      },
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

