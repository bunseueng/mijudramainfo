import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
import { MovieDB } from "@/helper/type";
const TopMovie = dynamic(() => import("./TopMovie"));
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Top Rated Movie",
  description: "Find Top Rated movie.",
  alternates: {
    canonical: `${process.env.BASE_URL}/movie/top`,
  },
};

const TopDramaPage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopMovie getMovie={getMovie as MovieDB[] | []} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
