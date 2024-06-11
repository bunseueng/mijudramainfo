import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, {params} : {params: {id: string}})  {
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const person = await prisma.person.findUnique({
        where: {
          personId: params.id,
        },
      });
  
      if (!person) {
        return NextResponse.json({ message: "Person not found" }, { status: 404 });
      }
  
      return NextResponse.json(person, { status: 200 });
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  }