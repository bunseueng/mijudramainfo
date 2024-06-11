import FilterQuery from "@/app/component/ui/Search/FilterQuery";

const SearchMovie = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
  return (
    <div>
      <FilterQuery BASE_URL={BASE_URL} />
    </div>
  );
};

export default SearchMovie;
