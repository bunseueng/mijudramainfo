import React from "react";
import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../page"));

const ProfileReviewsPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default ProfileReviewsPage;
