import React, { Suspense } from "react";
import PopularMovie from "./PopularMovie";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Popular Movie",
  description: "Find Popular movie.",
};

const PopularMoviePage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <PopularMovie />
      </Suspense>
    </div>
  );
};

export default PopularMoviePage;
