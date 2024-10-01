import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Lists` || "User's Lists",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}
const ListCreatePage = async ({ params }: { params: { name: string } }) => {
  return <ProfilePage params={params} />;
};

export default ListCreatePage;
