"use client";

import { fetchNewest } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

const NewestDrama = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Newest Drama";

  const { data: topDramas, isLoading } = useQuery({
    queryKey: ["newestDrama", currentPage],
    queryFn: () => fetchNewest(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topDramas?.total_results;

  if (isLoading) {
    return <ExploreLoading />;
  }
  return (
    <ExploreCard
      title={title}
      topDramas={topDramas}
      total_results={total_results}
    />
  );
};
//
export default NewestDrama;
