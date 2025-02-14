import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import ProfileItem from "./ProfileItem";
import { getProfileData } from "@/app/actions/getProfileData";
import { notFound } from "next/navigation";
export const revalidate = 0;
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const userData = await getProfileData(params.name);
  const user = userData?.user;
  const url = `${process.env.BASE_URL}/profile/${user?.name}`;

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
    title: `${user?.displayName || user?.name}'s Profile` || "User's Profile",
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

const ProfilePage = async (props: { params: Promise<{ name: string }> }) => {
  const name = (await props.params).name; // Extract name from params
  const userData = await getProfileData(name);

  const isUserExisted = userData?.users?.some((u) => u.name === name);

  if (!isUserExisted) {
    // Show "Not Found" only if user does NOT exist
    return notFound();
  }
  return (
    <main className="w-full h-full">
      <div className="relative">
        <div className="my-10">
          <Suspense key={name} fallback={<SearchLoading />}>
            <ProfileItem name={name} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
