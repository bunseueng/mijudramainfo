import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
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

const WatchlistPage = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return (
    <div>
      <ProfilePage params={params as any} />
    </div>
  );
};

export default WatchlistPage;
