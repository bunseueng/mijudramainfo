import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    try {
        const currentUser = await getCurrentUser();
    
        if (!currentUser) {
            return NextResponse.json({ message: "Invalid user" }, { status: 400 });
        }
        

        const findLove = await prisma.person.findUnique({
            where: {
                personId: params.id
            }
        });

        const updatedLove = findLove?.love || 0;
        const isLovedByCurrentUser = findLove?.lovedBy.includes(currentUser.id);
        
        const updatedLovedBy = findLove
            ? (isLovedByCurrentUser
                ? findLove.lovedBy.filter(id => id !== currentUser.id)
                : [...findLove.lovedBy, currentUser.id])
            : [currentUser.id];

        if (findLove) {
            const love = await prisma.person.update({
                where: {
                    personId: params.id
                },
                data: {
                    love: isLovedByCurrentUser ? updatedLove - 1 : updatedLove + 1,
                    lovedBy: updatedLovedBy
                }
            });
            return NextResponse.json({ love, message: "Success" }, { status: 200 });
        } else {
            const love = await prisma.person.create({
                data: {
                    personId: params.id,
                    love: isLovedByCurrentUser ? updatedLove - 1 : updatedLove + 1,
                    lovedBy: updatedLovedBy
                }
            });
            return NextResponse.json({ love, message: "Success" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
      const { ids } = await req.json()
  
      if (!Array.isArray(ids)) {
        return NextResponse.json({ message: "Invalid input: 'ids' must be an array" }, { status: 400 })
      }
  
      const persons = await prisma.person.findMany({
        where: {
          personId: {
            in: ids.map((id) => id.toString()),
          },
        },
      })
  
      // If you need to fetch additional data for each person, you can do it here
      const personsWithAdditionalData = await Promise.all(
        persons.map(async (person) => {
          // Example: Fetch additional data for each person
          // Replace this with your actual data fetching logic
          return { ...person }
        }),
      )
      return NextResponse.json(personsWithAdditionalData, { status: 200 })
    } catch (error) {
      console.error("Error fetching persons:", error)
      return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  }