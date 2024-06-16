import React, { Suspense } from "react";
import SearchQuery from "../../../component/ui/Search/SearchQuery";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const Collection = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/collection";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Collection;
