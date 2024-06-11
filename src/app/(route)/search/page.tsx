import { Suspense } from "react";
import SearchQuery from "../../component/ui/Search/SearchQuery";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const SearchPage = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/multi";
  const currentUser = await getCurrentUser();
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <SearchQuery BASE_URL={BASE_URL} currentUser={currentUser} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
