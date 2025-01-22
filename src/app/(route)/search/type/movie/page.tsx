import { Suspense } from "react";
import dynamic from "next/dynamic";
const FilterQuery = dynamic(
  () => import("@/app/component/ui/Search/FilterQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);
const SearchMovie = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default SearchMovie;
