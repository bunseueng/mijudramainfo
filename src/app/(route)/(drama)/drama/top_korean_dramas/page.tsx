import { Metadata } from "next";
import React, { Suspense } from "react";
import Top100Korean from "./Top100Korean";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Top 100 Korean Dramas",
  description: "Explore our Top 100 Korean Dramas",
};

const TopChineseDramas = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <Top100Korean />
      </Suspense>
    </div>
  );
};

export default TopChineseDramas;
