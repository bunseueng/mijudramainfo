import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const FilterQuery = dynamic(
  () => import("@/app/component/ui/Search/FilterQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);
export const revalidate = 0;
const Rating = () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Rating;
