import React, { Suspense } from "react";
import SearchQuery from "../../../component/ui/Search/SearchQuery";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const PersonPage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/person";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default PersonPage;
