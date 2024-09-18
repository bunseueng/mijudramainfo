import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const SearchQuery = dynamic(
  () => import("../../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const PersonPage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/person";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default PersonPage;
