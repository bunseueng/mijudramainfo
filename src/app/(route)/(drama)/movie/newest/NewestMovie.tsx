"use client";

import { fetchNewestMovie } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreMovieCard from "@/app/component/ui/Card/ExploreMovieCard";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const NewestMovie = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Newest Movie";

  const { data: newestMovie } = useQuery({
    queryKey: ["newestMovie", currentPage],
    queryFn: () => fetchNewestMovie(currentPage),
    placeholderData: keepPreviousData,
  });
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreMovieCard title={title} movie={newestMovie} />
    </Suspense>
  );
};
//
export default NewestMovie;
