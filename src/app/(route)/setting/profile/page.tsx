import React, { lazy } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
const ProfileSetting = lazy(() => import("./ProfileSetting"));
import { Metadata } from "next";

export const maxDuration = 60;
export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  return {
    title: `${user?.displayName || user?.name}'s Setting` || "User's Setting",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

const ProfileSettingPage = async () => {
  const user = await getCurrentUser();
  return <ProfileSetting user={user} />;
};

export default ProfileSettingPage;
