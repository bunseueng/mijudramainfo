"use client";

import { fetchUpcomingMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

const UpcomingMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Upcoming Drama";

  const { data: upcomingMovie, isLoading } = useQuery({
    queryKey: ["upcomingMovie", currentPage],
    queryFn: () => fetchUpcomingMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <ExploreLoading />;
  }
  return <ExploreMovieCard title={title} movie={upcomingMovie} />;
};

export default UpcomingMovie;
