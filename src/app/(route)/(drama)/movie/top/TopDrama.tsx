"use client";

import { fetchTopMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const TopMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top Movie";
  const { data: topMovie } = useQuery({
    queryKey: ["topMovie", currentPage],
    queryFn: () => fetchTopMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard title={title} movie={topMovie} />
    </Suspense>
  );
};

export default TopMovie;
