import React from "react";
import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../page"), { ssr: false });

const ProfileReviewsPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default ProfileReviewsPage;
