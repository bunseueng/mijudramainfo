"use client";

import { fetchTopMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { MovieProps } from "../popular/PopularMovie";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const TopMovie = ({ getMovie, personDB }: MovieProps) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top Movie";
  const { data: topMovie } = useQuery({
    queryKey: ["topMovie", currentPage],
    queryFn: () => fetchTopMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topMovie?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard
        title={title}
        movie={topMovie}
        total_results={total_results}
        getMovie={getMovie}
        personDB={personDB}
      />
    </Suspense>
  );
};

export default TopMovie;
