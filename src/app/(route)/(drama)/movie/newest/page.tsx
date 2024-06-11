import React, { Suspense } from "react";
import NewestMovie from "./NewestMovie";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Newest Movie",
  description: "Find Newest movie.",
};

const NewestMoviePage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <NewestMovie />
      </Suspense>
    </div>
  );
};

export default NewestMoviePage;
