'use server'

import prisma from "@/lib/db";

export const getExistingRatings = async () => {
  const existingRatings = await prisma.rating.findMany();
  return existingRatings
}