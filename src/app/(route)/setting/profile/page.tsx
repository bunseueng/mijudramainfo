import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
const ProfileSetting = dynamic(() => import("./ProfileSetting"), {
  ssr: false,
});

const ProfileSettingPage = async () => {
  const user = await getCurrentUser();
  return <ProfileSetting user={user} />;
};

export default ProfileSettingPage;
