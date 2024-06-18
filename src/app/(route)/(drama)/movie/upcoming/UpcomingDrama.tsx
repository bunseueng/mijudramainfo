"use client";

import { fetchUpcomingMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const UpcomingMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Upcoming Drama";

  const { data: upcomingMovie } = useQuery({
    queryKey: ["upcomingMovie", currentPage],
    queryFn: () => fetchUpcomingMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard title={title} movie={upcomingMovie} />;
    </Suspense>
  );
};

export default UpcomingMovie;
