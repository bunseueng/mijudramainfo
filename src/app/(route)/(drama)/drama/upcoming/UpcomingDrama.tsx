"use client";

import { fetchUpcoming } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Suspense } from "react";

const UpcomingDrama = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Upcoming Drama";

  const { data: topDramas } = useQuery({
    queryKey: ["upcomingDrama", currentPage],
    queryFn: () => fetchUpcoming(currentPage),
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

export default UpcomingDrama;
