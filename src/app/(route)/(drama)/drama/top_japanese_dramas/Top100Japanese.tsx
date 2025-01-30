"use client";

import {
  fetch100TopDrama,
  fetchRatings,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { Drama } from "../top/TopDrama";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const Top100Japanese = ({ getDrama, personDB }: Drama) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top 100 Japanese Drama";
  const per_page = searchParams?.get("per_page") || (20 as any);
  const countries = ["JP"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character"
  const { data: topDramas, isLoading: isTopDramasLoading } = useQuery({
    queryKey: ["top100JapaneseDrama", currentPage],
    queryFn: () => fetch100TopDrama(currentPage, countryParam),
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
  // Assuming 20 items are displayed per page
  const itemsPerPage = 20;

  // Assuming total_results holds the total number of items returned by the API
  const totalResults = topDramas?.total_results || 0;

  // Calculate the starting index of the items on the current page
  const startIndex = (currentPage - 1) * itemsPerPage + 1;

  // Calculate the ending index of the items on the current page
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

  // Calculate the total number of items being displayed on the current page
  const displayedItemsCount = endIndex - startIndex + 1;

  // Display the result as text
  const total_results = displayedItemsCount * 5;

  // Show loading state if any query is loading
  const isLoading = isTopDramasLoading || isRatingLoading || isTopDramaLoading;
  console.log(top_drama);
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
        total_results={total_results}
        currentPage={currentPage}
        getDrama={getDrama}
        personDB={personDB}
        tvRating={tvRating}
        top_drama={top_drama}
        items={total_results}
        setPage={setPage}
        per_page={per_page}
      />
    </Suspense>
  );
};

export default Top100Japanese;
