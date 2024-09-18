import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const PopularDrama = dynamic(() => import("./PopularDrama"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Popular Drama",
  description: "Find Popular drama.",
};
const PopularDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <PopularDrama />
      </Suspense>
    </div>
  );
};

export default PopularDramaPage;
