import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PopularMovie from "./PopularMovie";
import prisma from "@/lib/db";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Popular Movie",
  description: "Find Popular movie.",
};

const PopularMoviePage = async () => {
  const getMovie = await prisma.movie.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularMovie getMoive={getMovie} />
      </Suspense>
    </div>
  );
};

export default PopularMoviePage;
