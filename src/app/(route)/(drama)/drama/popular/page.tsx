import React, { Suspense } from "react";
import PopularDrama from "./PopularDrama";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
};
const PopularDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <PopularDrama />
      </Suspense>
    </div>
  );
};

export default PopularDramaPage;
