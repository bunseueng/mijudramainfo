import { Metadata } from "next";
import React, { Suspense } from "react";
import Top100Japanese from "./Top100Japanese";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Top 100 Japanese Dramas",
  description: "Explore our Top 100 Japanese Dramas",
};

const TopJapaneseDrama = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <Top100Japanese />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TopJapaneseDrama;
