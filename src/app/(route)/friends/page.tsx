import React from "react";
import Friend from "./Friend";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";

const FriendPage = async () => {
  const currentUser = await getCurrentUser();
  const user = await prisma?.user?.findMany({});
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
    <div>
      <Friend
        friend={friends}
        findSpecificUser={findSpecificUser}
        yourFriend={yourFriend}
        currentUser={currentUser}
      />
    </div>
  );
};

export default FriendPage;
