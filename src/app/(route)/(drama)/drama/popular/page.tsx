import React, { Suspense } from "react";
import PopularDrama from "./PopularDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

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
