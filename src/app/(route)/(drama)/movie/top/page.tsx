import React, { Suspense } from "react";
import TopDrama from "./TopDrama";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const metadata: Metadata = {
  title: "Top Rated Movie",
  description: "Find Top Rated movie.",
};

const TopDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopDrama />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
