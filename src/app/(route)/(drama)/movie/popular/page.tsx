import React, { Suspense } from "react";
import PopularMovie from "./PopularMovie";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

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
