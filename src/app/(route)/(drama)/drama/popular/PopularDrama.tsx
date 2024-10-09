"use client";

import { fetchPopular } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { DramaDB } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const PopularDrama = ({ getDrama }: DramaDB | any) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Popular Drama";

  const { data: topDramas } = useQuery({
    queryKey: ["popularDrama", currentPage],
    queryFn: () => fetchPopular(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topDramas?.total_results;

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreCard
        title={title}
        topDramas={topDramas}
        total_results={total_results}
        getDrama={getDrama}
      />
    </Suspense>
  );
};

export default PopularDrama;
