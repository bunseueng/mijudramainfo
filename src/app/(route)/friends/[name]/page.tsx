import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
import { Metadata } from "next";
const Friend = dynamic(() => import("./Friend"), { ssr: false });

export const metadata: Metadata = {
  title: "Friends",
  description: "All your friends lists",
};

const FriendPage = async ({ params }: { params: { name: string } }) => {
  const currentUser = await getCurrentUser();
  const user = await prisma?.user?.findUnique({
    where: { name: params?.name },
  });
  const users = await prisma?.user?.findMany({});
  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [{ friendRequestId: user?.id }, { friendRespondId: user?.id }],
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
