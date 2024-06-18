import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import FilterQuery from "@/app/component/ui/Search/FilterQuery";
import React, { Suspense } from "react";

const Genre = () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Genre;
