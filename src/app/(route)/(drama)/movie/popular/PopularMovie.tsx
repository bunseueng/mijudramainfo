"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchPopularMovie } from "@/app/actions/fetchMovieApi";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { MovieDB, PersonDBType } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export type MovieProps = {
  getMovie: MovieDB[];
  personDB: PersonDBType[] | any;
};
const PopularMovie = ({ getMovie, personDB }: MovieProps) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Popular Movie";

  const { data: popularMovie } = useQuery({
    queryKey: ["popularMovie", currentPage],
    queryFn: () => fetchPopularMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = popularMovie?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard
        title={title}
        movie={popularMovie}
        total_results={total_results}
        getMovie={getMovie}
        personDB={personDB}
      />
    </Suspense>
  );
};

export default PopularMovie;
