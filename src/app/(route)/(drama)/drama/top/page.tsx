import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const TopDrama = dynamic(() => import("./TopDrama"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const revalidate = 0;

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
