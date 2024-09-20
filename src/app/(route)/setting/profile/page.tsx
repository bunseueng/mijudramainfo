import React, { lazy } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
const ProfileSetting = lazy(() => import("./ProfileSetting"));

export const maxDuration = 60;

const ProfileSettingPage = async () => {
  const user = await getCurrentUser();
  return <ProfileSetting user={user} />;
};

export default ProfileSettingPage;
