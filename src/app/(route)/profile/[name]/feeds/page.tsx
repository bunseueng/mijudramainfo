import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Feeds` || "User's Feeds",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

const FeedsPage = async ({ params }: { params: { name: string } }) => {
  return <ProfilePage params={params} />;
};

export default FeedsPage;
