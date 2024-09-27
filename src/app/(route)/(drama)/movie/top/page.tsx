import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const TopMovie = dynamic(() => import("./TopMovie"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Top Rated Movie",
  description: "Find Top Rated movie.",
};

const TopDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopMovie />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
