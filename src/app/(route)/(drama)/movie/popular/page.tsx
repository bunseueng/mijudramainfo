import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PopularMovie from "./PopularMovie";
import prisma from "@/lib/db";
import { MovieDB } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Popular Movie",
  description: "Find Popular movie.",
  alternates: {
    canonical: `${process.env.BASE_URL}/movie/popular`,
  },
};

const PopularMoviePage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularMovie
          getMovie={getMovie as MovieDB[] | []}
          personDB={personDB}
        />
      </Suspense>
    </div>
  );
};

export default PopularMoviePage;
