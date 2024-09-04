import { Suspense } from "react";
import SearchQuery from "../../component/ui/Search/SearchQuery";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FilterQuery from "@/app/component/ui/Search/FilterQuery";

const SearchPage = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  const currentUser = await getCurrentUser();
  return (
    <div>
      <Suspense fallback={<SearchLoading />}>
        <FilterQuery BASE_URL={BASE_URL} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
