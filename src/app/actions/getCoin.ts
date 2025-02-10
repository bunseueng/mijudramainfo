'use server'

import prisma from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export const getCoin = async () => {
    const user = await getCurrentUser()
    const getCoin = await prisma.user.findUnique({
        where: {
          id: user?.id,
          email: user?.email,
        },
      });

      return getCoin
}