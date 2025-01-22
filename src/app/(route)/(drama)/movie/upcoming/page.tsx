import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const UpcomingMovie = dynamic(() => import("./UpcomingDrama"));
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Upcoming Movie",
  description: "Find Upcoming movie.",
};

const UpcomingDramaPage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingMovie getMovie={getMovie} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
