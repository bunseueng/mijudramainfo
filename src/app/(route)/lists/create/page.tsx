import React from "react";
import CreateList from "./CreateList";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const ListCreatePage = async () => {
  const user = await getCurrentUser();
  return <CreateList />;
};

export default ListCreatePage;
