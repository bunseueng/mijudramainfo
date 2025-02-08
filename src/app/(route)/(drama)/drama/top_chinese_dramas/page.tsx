import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Top100Chinese from "./Top100Chinese";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Top 100 Chinese Dramas",
  description: "Explore our Top 100 Chinese Dramas",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/top_chinese_dramas`,
  },
};

const TopChineseDramas = async () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Chinese />
      </Suspense>
    </div>
  );
};

export default TopChineseDramas;
