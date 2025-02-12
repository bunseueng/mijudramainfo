import { getServerSession } from "next-auth/next"
import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { currentUserProps } from "@/helper/type"
import { cache } from 'react'

export const getCurrentUser = cache(async (): Promise<currentUserProps | null> => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
})