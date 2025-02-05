import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  const url = `${process.env.BASE_URL}/profile/${user?.name}/reviews`;
  return {
    title: `${user?.displayName || user?.name}'s reviews` || "User's reviews",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
    keywords: user?.displayName || user?.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: user?.displayName || user?.name,
      description: user?.biography ?? `${user?.displayName || user?.name}`,
      images: [
        {
          url: `${user?.image || user?.profileAvatar}`,
          width: 1200,
          height: 630,
        },
      ],
    },
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
