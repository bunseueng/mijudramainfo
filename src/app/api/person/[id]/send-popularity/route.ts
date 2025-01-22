import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import {  NextResponse } from "next/server";

interface PopularityItem {
  itemId: string;
  personId: string;
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

// // Type guard to check if an array contains only PopularityItems
// const isPopularityItemArray = (arr: any): arr is PopularityItem[] => {
//   return Array.isArray(arr) && arr.every(isPopularityItem);
// };

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
      return NextResponse.json(
        { message: "You don't have enough coin" },
        { status: 404 }
      );
    }

    let updatingPopularity;
    let totalStarCount = 0;

    if (findPerson) {
      const existingPopularity: PopularityItem[] | any =
        findPerson.popularity || [];

      // Step 1: Merge new popularity with existing popularity
      const updatedPopularity = [...existingPopularity];

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
        // Increment totalStarCount
        totalStarCount += newPop.starCount;
      }

      // Ensure unique sentBy IDs
      const uniqueSentBy = Array.from(
        new Set([...findPerson.sentBy, currentUser.id])
      );

      // Step 2: Update person model, including totalPopularity
      updatingPopularity = await prisma.person.update({
        where: {
          personId: params.id,
        },
        data: {
          popularity: updatedPopularity as any,
          sentBy: uniqueSentBy as any,
          totalPopularity: {
            increment: totalStarCount, // Update total popularity by adding the new starCount
          },
        },
      });
    } else {
      // Calculate total popularity from the new popularity entries
      totalStarCount = popularity.reduce(
        (acc: number, pop: PopularityItem) => acc + pop.starCount,
        0
      );

      // Step 3: Create new person and set totalPopularity
      updatingPopularity = await prisma.person.create({
        data: {
          personId: params.id,
          popularity,
          sentBy: [currentUser?.id],
          totalPopularity: totalStarCount, // Set the initial totalPopularity
        },
      });
    }

    if (updatingPopularity) {
      // Step 4: Update user's coin balance
      await prisma.user.update({
        where: {
          id: currentUser?.id,
        },
        data: {
          coin: { decrement: calculateTotalCoins },
        },
      });

      const existingUserPopularitySent: PopularityItem[] | any =
        currentUser.popularitySent || [];
      const actorMap = new Map<string, PopularityItem[]>();

      // Step 5: Populate actorMap with existing popularity data
      for (const popArray of existingUserPopularitySent) {
        for (const item of popArray) {
          const { actorName } = item;
          if (!actorMap.has(actorName)) {
            actorMap.set(actorName, []);
          }
          actorMap.get(actorName)!.push(item);
        }
      }

      // Step 6: Merge new popularity data with the existing ones
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
          existingArray[existingPopIndex].starCount += newPop.starCount;
        } else {
          existingArray.push(newPop);
        }
      }

      // Fetch the existing totalPopularitySent from the user
      const existingTotalPopularitySent: PopularityItem[] | any = currentUser.totalPopularitySent || [];

      // Step 7: Create a map for existing totalPopularitySent entries by personId
      const totalPopularityMap = new Map(
        existingTotalPopularitySent.map(
          (pop: { personId: string | any}) => [pop.personId, pop]
        )
      );

      // Update or add the new popularity data for the specific personId
      for (const [actorName, popularityItems] of actorMap.entries() as any) {
        const totalStarCount = popularityItems.reduce((total: number, item: PopularityItem[] | any) => {
          return total + item.starCount;
        }, 0);

        const updatedPopularityEntry = {
          personId: params.id,
          actorName,
          totalPopularity: totalStarCount,
        };

        // If the personId already exists, update it, otherwise add a new entry
        if (totalPopularityMap.has(params.id)) {
          totalPopularityMap.set(params.id, updatedPopularityEntry);
        } else {
          totalPopularityMap.set(params.id, updatedPopularityEntry);
        }
      }

      // Convert the map back to an array for updating the database
      const updatedTotalPopularitySent = Array.from(totalPopularityMap.values());

      // Step 8: Update user model with popularitySent and totalPopularitySent
      await prisma.user.update({
        where: {
          id: currentUser?.id,
        },
        data: {
          popularitySent: Array.from(actorMap.values()) as any, // Fixed to correctly update popularitySent
          totalPopularitySent: updatedTotalPopularitySent as any, // Use the updated array
        },
      });
    }

    return NextResponse.json(
      { updatingPopularity, message: "Success" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


let currentIndex = 0;
export async function GET(req: Request) {
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

