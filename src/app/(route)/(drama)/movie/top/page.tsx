import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import prisma from "@/lib/db";
const TopMovie = dynamic(() => import("./TopMovie"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Top Rated Movie",
  description: "Find Top Rated movie.",
};

const TopDramaPage = async () => {
  const getMovie = await prisma.movie.findMany();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopMovie getMovie={getMovie} />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
