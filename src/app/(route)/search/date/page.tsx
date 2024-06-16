import React, { Suspense } from "react";
import FilterQuery from "@/app/component/ui/Search/FilterQuery";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const Date = () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Date;
