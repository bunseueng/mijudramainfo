import Results from "@/app/component/ui/Search/Results";
import React from "react";
import SearchQuery from "../../../component/ui/Search/SearchQuery";

const Collection = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/collection";
  return (
    <div>
      <SearchQuery BASE_URL={BASE_URL} />
    </div>
  );
};

export default Collection;
