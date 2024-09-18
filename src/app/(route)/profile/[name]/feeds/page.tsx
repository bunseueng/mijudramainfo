import React from "react";
import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../page"));

const FeedsPage = async ({ params }: { params: { name: string } }) => {
  return <ProfilePage params={params} />;
};

export default FeedsPage;
