import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const Top100Korean = dynamic(() => import("./Top100Korean"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Top 100 Korean Dramas",
  description: "Explore our Top 100 Korean Dramas",
};

const TopChineseDramas = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Korean />
      </Suspense>
    </div>
  );
};

export default TopChineseDramas;
