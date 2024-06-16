import React, { Suspense } from "react";
import PopularDrama from "./PopularDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
};
const PopularDramaPage = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <PopularDrama />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default PopularDramaPage;
