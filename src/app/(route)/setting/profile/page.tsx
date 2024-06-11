import React from "react";
import ProfileSetting from "./ProfileSetting";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const ProfileSettingPage = async () => {
  const user = await getCurrentUser();
  return (
    <div>
      <ProfileSetting user={user} />
    </div>
  );
};

export default ProfileSettingPage;
