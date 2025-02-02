import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod"
import bcrypt from "bcrypt";

const userSchma = z.object({
    name: z.string().min(3, { message: "Username is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
})

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const {email, name, password} = userSchma.parse(body)
    
        const findUserByUsernameAndEmail = await prisma.user.findUnique({
            where: {
                email,
            }
        })
    
        if(findUserByUsernameAndEmail) {
            return NextResponse.json({user: null, message: "Username or Email already exists"}, {status: 404})
        }
    
        const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    hashedPassword,
                    gender: "-",
                    image: "/default-pf.webp"
                }
            })
                const {hashedPassword: newUserPassword, ...rest} = newUser
                return NextResponse.json({user: rest, message: "User created successfully"}, {status: 200})

    }catch (err) {
        return NextResponse.json({message: "Failed to create user"}, {status: 500})
    }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("friQ") || "";

    // Return empty array if no query is provided
    if (!query) {
      return NextResponse.json({ users: [], message: "No search query provided" }, { status: 200 });
    }

    // Fetch users if query is provided
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json({ users, message: "Getting User" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
