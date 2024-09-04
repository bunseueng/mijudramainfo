import React from "react";
import ProfilePage from "../page";

const ProfileReviewsPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default ProfileReviewsPage;
