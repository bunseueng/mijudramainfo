import { Metadata } from "next";
import React, { Suspense } from "react";
import Top100Chinese from "./Top100Chinese";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Top 100 Chinese Dramas",
  description: "Explore our Top 100 Chinese Dramas",
};

const TopChineseDramas = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <Top100Chinese />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TopChineseDramas;
