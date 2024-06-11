import React from "react";
import ProfilePage from "../page";

const ListCreatePage = async ({ params }: { params: { name: string } }) => {
  return (
    <>
      <ProfilePage params={params} />
    </>
  );
};

export default ListCreatePage;
