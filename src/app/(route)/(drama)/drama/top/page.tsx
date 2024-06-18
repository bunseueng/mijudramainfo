import React, { Suspense } from "react";
import TopDrama from "./TopDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const metadata: Metadata = {
  title: "Top Rated Drama",
  description: "Find Top Rated drama.",
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
