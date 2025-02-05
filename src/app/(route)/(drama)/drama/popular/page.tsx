import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const PopularDrama = dynamic(() => import("./PopularDrama"));
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/popular`,
  },
};
const PopularDramaPage = async () => {
  const getDrama = await prisma.drama.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularDrama getDrama={getDrama} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default PopularDramaPage;
