import { Suspense } from "react";
import SearchQuery from "../../component/ui/Search/SearchQuery";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const SearchPage = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/multi";
  const currentUser = await getCurrentUser();
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} currentUser={currentUser} />
    </Suspense>
  );
};

export default SearchPage;
