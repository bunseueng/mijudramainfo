'use server'

import prisma from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser";

export const getUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
  
      if (!currentUser) {
        throw new Error("Current user not found");
      }
  
      const users = await prisma?.user?.findMany({});
      const friend = await prisma?.friend?.findMany({
        where: {
          OR: [
            { friendRequestId: currentUser?.id },
            { friendRespondId: currentUser?.id },
          ],
        },
      });
      const comment = await prisma.comment.findMany({});
      
      const findSpecificUser = users.filter((user: any) =>
        friend.map((friend: any) => friend.friendRequestId).includes(user.id)
      );
      
      const yourFriend = users.filter((user: any) =>
        friend.map((friend: any) => friend.friendRespondId).includes(user.id)
      );
  
      return {
        currentUser,
        users,
        findSpecificUser,
        yourFriend,
        friend,
        comment,
      };
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  }
  