import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PopularMovie from "./PopularMovie";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Popular Movie",
  description: "Find Popular movie.",
};

const PopularMoviePage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularMovie getMovie={getMovie} personDB={personDB} />
      </Suspense>
    </div>
  );
};

export default PopularMoviePage;
