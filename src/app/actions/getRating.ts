import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
      const { tvId } = req.json() as any;
    const ratings = await prisma.rating.findMany({
      where: { tvId: tvId },
    });
    return NextResponse.json({ ratings });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
