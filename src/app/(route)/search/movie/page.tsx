import React from "react";
import SearchQuery from "../../../component/ui/Search/SearchQuery";

const MoviePage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/movie";
  return (
    <div>
      <SearchQuery BASE_URL={BASE_URL} />
    </div>
  );
};

export default MoviePage;
