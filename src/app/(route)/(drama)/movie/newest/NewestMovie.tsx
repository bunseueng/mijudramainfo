"use client";

import { fetchNewestMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

const NewestMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const title = "Newest Movie";

  const { data: newestMovie, isLoading } = useQuery({
    queryKey: ["newestMovie", currentPage],
    queryFn: () => fetchNewestMovie(currentPage),
    placeholderData: keepPreviousData,
  });
  if (isLoading) {
    return <ExploreLoading />;
  }
  return <ExploreMovieCard title={title} movie={newestMovie} />;
};
//
export default NewestMovie;
