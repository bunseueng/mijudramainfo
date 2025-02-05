import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
const FilterQuery = dynamic(
  () => import("@/app/component/ui/Search/FilterQuery")
);
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading")
);

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/search/company`;
  return {
    title: "Search Company",
    alternates: {
      canonical: url,
    },
  };
}
const Company = () => {
  const BASE_URL = "https://api.themoviedb.org/3/discover/tv";
  return (
    <Suspense fallback={<SearchLoading />}>
      <FilterQuery BASE_URL={BASE_URL} />
    </Suspense>
  );
};

export default Company;
