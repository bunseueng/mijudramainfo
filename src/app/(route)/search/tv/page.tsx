import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
const SearchQuery = dynamic(
  () => import("../../../component/ui/Search/SearchQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);
export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/search/tv`;
  return {
    title: "Search Tv Shows",
    alternates: {
      canonical: url,
    },
  };
}
const TvPage = () => {
  const BASE_URL = "https://api.themoviedb.org/3/search/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default TvPage;
