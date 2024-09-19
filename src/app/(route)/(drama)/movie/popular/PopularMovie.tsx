"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchPopularMovie } from "@/app/actions/fetchMovieApi";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const PopularMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Popular Movie";

  const { data: popularMovie, isLoading } = useQuery({
    queryKey: ["popularMovie", currentPage],
    queryFn: () => fetchPopularMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard title={title} movie={popularMovie} />
    </Suspense>
  );
};

export default PopularMovie;
