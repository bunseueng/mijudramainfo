import { Suspense } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import dynamic from "next/dynamic";
const SearchQuery = dynamic(
  () => import("../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);
export const revalidate = 0;

const SearchPage = async () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/multi";
  const currentUser = await getCurrentUser();
  return (
    <div>
      <Suspense fallback={<SearchLoading />}>
        <SearchQuery BASE_URL={BASE_URL} currentUser={currentUser} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
