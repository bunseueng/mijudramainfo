import React from "react";
import ProfilePage from "../page";

const WatchlistPage = async ({ params }: { params: { name: string } }) => {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
};

export default WatchlistPage;
