import { getCurrentUser } from "@/app/actions/getCurrentUser";
import React, { Suspense } from "react";
import prisma from "@/lib/db";
import Navbar from "./Navbar";

export const revalidate = 0;

const SessionAllPage = async () => {
  const users = await prisma?.user?.findMany({});
  const currentUser = await getCurrentUser();
  const user = users?.find((item: any) => item?.id === currentUser?.id);
  const friend = await prisma?.friend?.findMany({
    where: {
      OR: [
        { friendRequestId: currentUser?.id },
        { friendRespondId: currentUser?.id },
      ],
    },
  });

  const comment = await prisma.comment.findMany({});

  const findSpecificUser = users?.filter((user: any) =>
    friend?.map((friend: any) => friend?.friendRequestId).includes(user?.id)
  );

  const yourFriend = users?.filter((user: any) =>
    friend?.map((friend: any) => friend?.friendRespondId).includes(user?.id)
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar
        users={users}
        user={user}
        currentUser={currentUser}
        findSpecificUser={findSpecificUser}
        yourFriend={yourFriend}
        friend={friend}
        comment={comment}
      />
    </Suspense>
  );
};

export default SessionAllPage;
