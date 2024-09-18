import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
const CreateList = dynamic(() => import("./CreateList"), { ssr: false });

const ListCreatePage = async () => {
  const currentUser = await getCurrentUser();
  return <CreateList currentUser={currentUser} />;
};

export default ListCreatePage;
