import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
import { MovieDB } from "@/helper/type";
import UpcomingMovie from "./UpcomingMovie";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Upcoming Movie",
  description: "Find Upcoming movie.",
  alternates: {
    canonical: `${process.env.BASE_URL}/movie/upcoming`,
  },
};

const UpcomingDramaPage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingMovie
          getMovie={getMovie as MovieDB[] | []}
          personDB={personDB}
        />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
