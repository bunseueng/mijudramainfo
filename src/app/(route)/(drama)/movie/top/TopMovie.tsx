"use client";

import { fetchRatings, fetchTopMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { MovieProps } from "../popular/PopularMovie";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const TopMovie = ({ getMovie, personDB }: MovieProps) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const title = "Top Movie";
  const { data: topMovie, isLoading: isMovieLoading } = useQuery({
    queryKey: ["topMovie", currentPage],
    queryFn: () => fetchTopMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const items = topMovie?.total_results;
  const totalItems = topMovie?.results?.slice(start, end) || []; // Use slice on results
  const result_id = totalItems?.map((movie: any) => movie?.id);

  // Only fetch ratings when we have result_ids
  const { data: tvRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ["tvRating", result_id],
    queryFn: () => fetchRatings(result_id),
    staleTime: 3600000,
    enabled: Boolean(result_id?.length),
  });

  // Show loading state if any query is loading
  const isLoading = isMovieLoading || isRatingLoading;

  if (isLoading) {
    return <SearchLoading />;
  }

  // Only render when we have all the data
  if (!topMovie || !totalItems || !tvRating) {
    return <SearchLoading />;
  }
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard
        title={title}
        totalItems={totalItems}
        total_results={totalItems?.total_results}
        tvRating={tvRating}
        getMovie={getMovie}
        personDB={personDB}
        items={items}
        per_page={per_page}
        setPage={setPage}
        currentPage={currentPage}
      />
    </Suspense>
  );
};

export default TopMovie;
