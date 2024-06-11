"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import { fetchPopularMovie } from "@/app/actions/fetchMovieApi";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

const PopularMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const title = "Popular Movie";

  const { data: popularMovie, isLoading } = useQuery({
    queryKey: ["popularMovie", currentPage],
    queryFn: () => fetchPopularMovie(currentPage),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <ExploreLoading />;
  }
  return <ExploreMovieCard title={title} movie={popularMovie} />;
};

export default PopularMovie;
