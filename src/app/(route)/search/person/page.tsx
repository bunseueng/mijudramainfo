import React from "react";
import SearchQuery from "../../../component/ui/Search/SearchQuery";

const PersonPage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/person";
  return (
    <div>
      <SearchQuery BASE_URL={BASE_URL} />
    </div>
  );
};

export default PersonPage;
