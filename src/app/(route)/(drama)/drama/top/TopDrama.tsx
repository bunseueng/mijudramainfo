"use client";

import { fetchTopDrama } from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ExploreCard from "@/app/component/ui/Card/ExploreCard";
import { DramaDB, PersonDBType } from "@/helper/type";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export type Drama = {
  getDrama: DramaDB[] | any;
  personDB: PersonDBType[] | any;
};

const TopDrama = ({ getDrama, personDB }: Drama) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const title = "Top Drama";
  const { data: topDramas } = useQuery({
    queryKey: ["topDrama", currentPage],
    queryFn: () => fetchTopDrama(currentPage),
    placeholderData: keepPreviousData,
  });

  const total_results = topDramas?.total_results;
  return (
    <Suspense fallback={<SearchLoading />}>
      <ExploreCard
        title={title}
        topDramas={topDramas}
        total_results={total_results}
        getDrama={getDrama}
        personDB={personDB}
      />
    </Suspense>
  );
};

export default TopDrama;
