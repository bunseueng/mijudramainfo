import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title:
      `${user?.displayName || user?.name}'s Watchlist` || "User's Watchlist",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

const WatchlistPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default WatchlistPage;
