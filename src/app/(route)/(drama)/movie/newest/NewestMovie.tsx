"use client";

import { fetchNewestMovie } from "@/app/actions/fetchMovieApi";
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

const NewestMovie = ({ getMovie, personDB }: MovieProps) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Newest Movie";

  const { data: newestMovie } = useQuery({
    queryKey: ["newestMovie", currentPage],
    queryFn: () => fetchNewestMovie(currentPage),
    placeholderData: keepPreviousData,
  });
  const total_results = newestMovie?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard
        title={title}
        movie={newestMovie}
        total_results={total_results}
        getMovie={getMovie}
        personDB={personDB}
      />
    </Suspense>
  );
};
//
export default NewestMovie;
