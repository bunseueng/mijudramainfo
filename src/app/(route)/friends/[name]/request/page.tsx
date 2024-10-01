import React from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
import { Metadata } from "next";
const FriendRequest = dynamic(() => import("./FriendRequest"), { ssr: false });

export const metadata: Metadata = {
  title: "Friend Request",
  description: "All of your friends request in this website.",
};

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
