import React from "react";
import FilterQuery from "@/app/component/ui/Search/FilterQuery";

const Keyword = () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  return (
    <div>
      <FilterQuery BASE_URL={BASE_URL} />
    </div>
  );
};

export default Keyword;
