import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import NewestDrama from "./NewestDrama";
import prisma from "@/lib/db";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
};

const NewestDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <NewestDrama getDrama={getDrama} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default NewestDramaPage;
