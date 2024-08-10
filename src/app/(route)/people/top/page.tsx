import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Metadata } from "next";
import React, { Suspense } from "react";
import TopPeople from "./TopPeople";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { currentUserProps } from "@/helper/type";
import prisma from "@/lib/db";
import { PersonDb } from "@/app/component/ui/Fetching/Person";

export const metadata: Metadata = {
  title: "Top People",
  description: "Find Top People.",
};

const TopActorPage = async () => {
  const currentUser = (await getCurrentUser()) as currentUserProps;
  const personDB = await prisma?.person?.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopPeople currentUser={currentUser} personDB={personDB as any} />
      </Suspense>
    </div>
  );
};

export default TopActorPage;
