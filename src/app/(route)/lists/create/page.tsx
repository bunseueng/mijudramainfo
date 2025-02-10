export const dynamic = "force-dynamic";
import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import CreateList from "./CreateList";

const ListCreatePage = async () => {
  const currentUser = await getCurrentUser();
  return <CreateList currentUser={currentUser} />;
};

export default ListCreatePage;
