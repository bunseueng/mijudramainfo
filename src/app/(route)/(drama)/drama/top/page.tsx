import React, { Suspense } from "react";
import TopDrama from "./TopDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Top Rated Drama",
  description: "Find Top Rated drama.",
};

const TopDramaPage = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <TopDrama />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TopDramaPage;
