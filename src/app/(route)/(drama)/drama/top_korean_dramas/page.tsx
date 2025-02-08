import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Top100Korean from "./Top100Korean";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Top 100 Korean Dramas",
  description: "Explore our Top 100 Korean Dramas",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/top_korean_dramas`,
  },
};

const TopChineseDramas = async () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Korean />
      </Suspense>
    </div>
  );
};

export default TopChineseDramas;
