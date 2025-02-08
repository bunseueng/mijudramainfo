"use client";

import {
  fetchPopular,
  fetchRatings,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { useDatabase } from "@/hooks/useDatabase";
import { DramaDB, PersonDBType } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const PopularDrama = () => {
  const { data } = useDatabase();
  const { getDrama, personDB } = { ...data };
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Popular Drama";
  const [page, setPage] = useState(1);
  const per_page = searchParams?.get("per_page") || (20 as any);

  const { data: topDramas, isLoading: isTopDramasLoading } = useQuery({
    queryKey: ["popularDrama", currentPage],
    queryFn: () => fetchPopular(currentPage),
    placeholderData: keepPreviousData,
  });

  // Calculate slice only when topDramas is available
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const totalItems = topDramas?.results?.slice(start, end);
  const result_id = totalItems?.map((drama: any) => drama?.id);

  // Only fetch ratings when we have result_ids
  const { data: tvRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ["tvRating", result_id],
    queryFn: () => fetchRatings(result_id),
    staleTime: 3600000,
    enabled: Boolean(result_id?.length),
  });

  // Only fetch episodes when we have result_ids
  const { data: top_drama, isLoading: isTopDramaLoading } = useQuery({
    queryKey: ["top_drama", result_id],
    queryFn: () => fetchTv(result_id),
    staleTime: 3600000,
    enabled: Boolean(result_id?.length),
  });

  // Show loading state if any query is loading
  const isLoading = isTopDramasLoading || isRatingLoading || isTopDramaLoading;

  if (isLoading) {
    return <SearchLoading />;
  }

  // Only render when we have all the data
  if (!topDramas || !totalItems || !tvRating || !top_drama) {
    return <SearchLoading />;
  }

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreCard
        title={title}
        total_results={topDramas.total_results}
        currentPage={currentPage}
        getDrama={getDrama as DramaDB[] | []}
        personDB={personDB as PersonDBType[] | []}
        tvRating={tvRating}
        top_drama={top_drama}
        items={topDramas.total_results}
        setPage={setPage}
        per_page={per_page}
      />
    </Suspense>
  );
};

export default PopularDrama;
