import React from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { getProfileData } from "@/app/actions/getProfileData";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const userData = await getProfileData(params.name);
  const user = userData?.user;
  const url = `${process.env.BASE_URL}/profile/${user?.name}/lists`;

  const isUserExisted = userData?.users?.some((u) => u.name === params.name);
  if (!isUserExisted) {
    return {
      title: "User's Profile",
      alternates: {
        canonical: `${process.env.BASE_URL}`,
      },
    };
  }
  return {
    title: `${user?.displayName || user?.name}'s list` || "User's list",
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
const ListCreatePage = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return <ProfilePage params={params as any} />;
};

export default ListCreatePage;
