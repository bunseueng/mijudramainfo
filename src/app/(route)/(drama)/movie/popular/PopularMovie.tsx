"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { fetchPopularMovie } from "@/app/actions/fetchMovieApi";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Suspense } from "react";

const PopularMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Popular Movie";

  const { data: popularMovie } = useQuery({
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
