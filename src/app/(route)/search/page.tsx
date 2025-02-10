export const dynamic = "force-dynamic";
import { lazy, Suspense } from "react";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
const SearchLoading = lazy(
  () => import("@/app/component/ui/Loading/SearchLoading")
);
const SearchQuery = lazy(() => import("../../component/ui/Search/SearchQuery"));

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/search`;
  return {
    title: "Search",
    alternates: {
      canonical: url,
    },
  };
}

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
