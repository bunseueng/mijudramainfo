import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import NewestMovie from "./NewestMovie";
import prisma from "@/lib/db";
import { MovieDB } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Newest Movie",
  description: "Find Newest movie.",
};

const NewestMoviePage = async () => {
  const getMovie = await prisma.movie.findMany();
  const personDB = await prisma.person.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <NewestMovie
          getMovie={getMovie as MovieDB[] | []}
          personDB={personDB}
        />
      </Suspense>
    </div>
  );
};

export default NewestMoviePage;
