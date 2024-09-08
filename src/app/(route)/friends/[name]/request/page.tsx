import React from "react";
import FriendRequest from "./FriendRequest";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const FriendRequestPage = async ({ params }: { params: { name: string } }) => {
  const currentUser = await getCurrentUser();
  const user = await prisma.user.findUnique({ where: { name: params.name } });
  const friend = await prisma.friend.findMany({});
  if (!currentUser || friend.length === 0) {
    // Render loading state or skeleton here
    return <div>Loading...</div>;
  }
  return (
    <FriendRequest friend={friend} currentUser={currentUser} user={user} />
  );
};

export default FriendRequestPage;
