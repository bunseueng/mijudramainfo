import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
const Notifications = dynamic(() => import("./Notifications"));

const NotificaitonsPage = async () => {
  const currentUser = await getCurrentUser();
  const user = await prisma.user.findMany();
  const friend = await prisma.friend.findMany({});
  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [
        { friendRequestId: currentUser?.id },
        { friendRespondId: currentUser?.id },
      ],
    },
  });

  const findSpecificUser = user?.filter((user: any) =>
    friends?.map((friend: any) => friend?.friendRequestId).includes(user?.id)
  );

  const yourFriend = user?.filter((user: any) =>
    friends?.map((friend: any) => friend?.friendRespondId).includes(user?.id)
  );
  return (
    <Notifications
      currentUser={currentUser}
      friend={friend}
      findSpecificUser={findSpecificUser}
      yourFriend={yourFriend}
    />
  );
};

export default NotificaitonsPage;
