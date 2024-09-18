import React from "react";
import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../page"));

const WatchlistPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default WatchlistPage;
