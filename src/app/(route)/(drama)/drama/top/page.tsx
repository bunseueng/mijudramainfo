import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import TopDrama from "./TopDrama";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Top Rated Drama",
  description: "Find Top Rated drama.",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/top`,
  },
};

const TopDramaPage = async () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <TopDrama />
      </Suspense>
    </div>
  );
};

export default TopDramaPage;
