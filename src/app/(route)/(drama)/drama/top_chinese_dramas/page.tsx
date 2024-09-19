import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const Top100Chinese = dynamic(() => import("./Top100Chinese"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Top 100 Chinese Dramas",
  description: "Explore our Top 100 Chinese Dramas",
};

const TopChineseDramas = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Chinese />
      </Suspense>
    </div>
  );
};

export default TopChineseDramas;
