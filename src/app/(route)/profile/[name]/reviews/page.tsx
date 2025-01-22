import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Reviews` || "User's Reviews",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

const ProfileReviewsPage = async (props: {
  params: Promise<{ name: string }>;
}) => {
  const params = await props.params;
  return (
    <div>
      <ProfilePage params={params as any} />
    </div>
  );
};

export default ProfileReviewsPage;
