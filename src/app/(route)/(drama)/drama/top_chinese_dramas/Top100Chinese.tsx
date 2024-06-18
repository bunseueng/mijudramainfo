"use client";

import { fetch100TopDrama } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const Top100Chinese = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top 100 Chinese Drama";
  const countries = ["CN"]; // Example: add your desired countries here
  const countryParam = countries.join("|"); // Join countries with a pipe character"
  const { data: topDramas, isLoading } = useQuery({
    queryKey: ["top100ChineseDrama", currentPage],
    queryFn: () => fetch100TopDrama(currentPage, countryParam),
    placeholderData: keepPreviousData,
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

export default Top100Chinese;
