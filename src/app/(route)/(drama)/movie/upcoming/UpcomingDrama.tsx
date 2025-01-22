"use client";

import { fetchUpcomingMovie } from "@/app/actions/fetchMovieApi";
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

export const revalidate = 0;

const UpcomingMovie = ({ getMovie, personDB }: MovieProps) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Upcoming Drama";

  const { data: upcomingMovie } = useQuery({
    queryKey: ["upcomingMovie", currentPage],
    queryFn: () => fetchUpcomingMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = upcomingMovie?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard
        title={title}
        movie={upcomingMovie}
        getMovie={getMovie}
        total_results={total_results}
        personDB={personDB}
      />
      ;
    </Suspense>
  );
};

export default UpcomingMovie;
