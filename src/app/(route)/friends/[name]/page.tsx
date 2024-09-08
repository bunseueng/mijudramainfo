import React from "react";
import Friend from "./Friend";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";

const FriendPage = async ({ params }: { params: { name: string } }) => {
  const currentUser = await getCurrentUser();
  const user = await prisma?.user?.findUnique({
    where: { name: params?.name },
  });
  const users = await prisma?.user?.findMany({});
  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [
        { friendRequestId: currentUser?.id },
        { friendRespondId: currentUser?.id },
      ],
    },
  });

  return (
    <div>
      <Friend
        user={user}
        users={users}
        friend={friends}
        currentUser={currentUser}
      />
    </div>
  );
};

export default FriendPage;
