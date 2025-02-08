'use server'

import prisma from "@/lib/db";

export const getUserFriends = async (userId: string) => {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { friendRequestId: userId },
          { friendRespondId: userId }
        ],
        status: 'accepted'
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
            profileAvatar: true,
            country: true
          }
        },
        responder: {
          select: {
            id: true,
            name: true,
            image: true,
            profileAvatar: true,
            country: true
          }
        }
      }
    });

    // Transform the data to only show the friend's information
    return friends.map(friend => {
      // If the owner is the requester, return responder's info
      // If the owner is the responder, return requester's info
      const friendInfo = friend.friendRequestId === userId ? friend.responder : friend.requester;
      
      return {
        id: friend.id,
        friendId: friendInfo.id,
        name: friendInfo.name,
        image: friendInfo.image,
        profileAvatar: friendInfo.profileAvatar,
        country: friendInfo.country,
        status: friend.status,
        actionDatetime: friend.actionDatetime,
        notification: friend.notification,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt
      };
    });
}