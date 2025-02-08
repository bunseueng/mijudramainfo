import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const PopularDrama = dynamic(() => import("./PopularDrama"));
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
  alternates: {
    canonical: `${process.env.BASE_URL}/drama/popular`,
  },
};
const PopularDramaPage = async () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularDrama />
      </Suspense>
    </div>
  );
};

export default PopularDramaPage;
