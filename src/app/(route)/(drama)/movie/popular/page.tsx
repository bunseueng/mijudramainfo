import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import PopularMovie from "./PopularMovie";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Popular Movie",
  description: "Find Popular movie.",
};

const PopularMoviePage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularMovie />
      </Suspense>
    </div>
  );
};

export default PopularMoviePage;
