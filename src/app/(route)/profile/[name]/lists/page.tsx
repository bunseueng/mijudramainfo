import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Lists` || "User's Lists",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}
const ListCreatePage = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return <ProfilePage params={params as any} />;
};

export default ListCreatePage;
