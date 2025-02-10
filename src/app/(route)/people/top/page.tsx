export const dynamic = "force-dynamic";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Metadata } from "next";
import React, { Suspense } from "react";
import TopPeople from "./TopPeople";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { currentUserProps } from "@/helper/type";

export const metadata: Metadata = {
  title: "Top People",
  description: "Find Top People.",
};

const TopActorPage = async () => {
  const currentUser = (await getCurrentUser()) as currentUserProps;
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopPeople currentUser={currentUser} />
      </Suspense>
    </div>
  );
};

export default TopActorPage;
