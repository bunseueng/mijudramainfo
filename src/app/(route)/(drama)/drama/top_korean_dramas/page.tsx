import { Metadata } from "next";
import React, { Suspense } from "react";
import Top100Korean from "./Top100Korean";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Top 100 Korean Dramas",
  description: "Explore our Top 100 Korean Dramas",
};

const TopChineseDramas = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <Top100Korean />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TopChineseDramas;
