import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const UpcomingMovie = dynamic(() => import("./UpcomingDrama"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Upcoming Movie",
  description: "Find Upcoming movie.",
};

const UpcomingDramaPage = async () => {
  const getMovie = await prisma.movie.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingMovie getMovie={getMovie} />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
