"use client";

import { fetchTopMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

const TopMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const title = "Top Movie";
  const { data: topMovie, isLoading } = useQuery({
    queryKey: ["topMovie", currentPage],
    queryFn: () => fetchTopMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <ExploreLoading />;
  }
  return <ExploreMovieCard title={title} movie={topMovie} />;
};

export default TopMovie;
