import React from "react";
import FriendRequest from "./FriendRequest";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const FriendRequestPage = async () => {
  const currentUser = await getCurrentUser();
  const friend = await prisma.friend.findMany({});
  if (!currentUser || friend.length === 0) {
    // Render loading state or skeleton here
    return <div>Loading...</div>;
  }
  return <FriendRequest friend={friend} currentUser={currentUser} />;
};

export default FriendRequestPage;
