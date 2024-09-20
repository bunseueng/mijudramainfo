import React from "react";
import ProfilePage from "../page";

export const maxDuration = 60;
const FeedsPage = async ({ params }: { params: { name: string } }) => {
  return <ProfilePage params={params} />;
};

export default FeedsPage;
