import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const SearchQuery = dynamic(
  () => import("../../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);
const Collection = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/collection";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Collection;
