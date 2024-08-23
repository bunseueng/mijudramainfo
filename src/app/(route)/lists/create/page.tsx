import React from "react";
import CreateList from "./CreateList";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const ListCreatePage = async () => {
  const currentUser = await getCurrentUser();
  return <CreateList currentUser={currentUser} />;
};

export default ListCreatePage;
