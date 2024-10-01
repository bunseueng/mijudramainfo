import React from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
import { Metadata } from "next";
const UserSearch = dynamic(() => import("./UserSearch"), { ssr: false });

export const metadata: Metadata = {
  title: "Searching User",
  description: "Searching for all users in this website.",
};

const SearchPag = async ({ params }: { params: { name: string } }) => {
  const currentUser = await getCurrentUser();
  const user = await prisma?.user?.findUnique({
    where: { name: params?.name },
  });
  const users = await prisma?.user?.findMany({});
  const findFriendId = await prisma.friend?.findFirst({
    where: {
      friendRequestId: currentUser?.id as string,
      friendRespondId: user?.id as string,
    },
  });
  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [{ friendRequestId: user?.id }, { friendRespondId: user?.id }],
    },
  });

  return (
    <UserSearch
      user={user}
      users={users}
      friend={friends}
      findFriendId={findFriendId}
      currentUser={currentUser}
      list={null}
      tvid={[]}
      movieId={[]}
      tv_id={[]}
      formattedDate={""}
      lastLogin={""}
      existedFavorite={[]}
    />
  );
};

export default SearchPag;
