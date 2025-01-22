import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const SearchQuery = dynamic(
  () => import("../../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);
export const revalidate = 0;
const TvPage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default TvPage;
