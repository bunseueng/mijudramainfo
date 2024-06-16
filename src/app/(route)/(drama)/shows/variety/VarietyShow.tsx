"use client";

import { fetchVariety } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const VarietyShow = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Variety Shows";
  const { data: topDramas } = useQuery({
    queryKey: ["variety", currentPage],
    queryFn: () => fetchVariety(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topDramas?.total_results;

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreCard
        title={title}
        topDramas={topDramas}
        total_results={total_results}
      />
    </Suspense>
  );
};

export default VarietyShow;
