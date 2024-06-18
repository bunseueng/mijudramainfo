import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import FilterQuery from "@/app/component/ui/Search/FilterQuery";
import { Suspense } from "react";

const SearchMovie = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default SearchMovie;
