"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBatchTv, fetchTrending } from "@/app/actions/fetchMovieApi";
import HomeCard from "../Card/HomeCard";
import { HomeDramaT } from "../Main/Section";

const TrendingDrama = ({ heading, getDrama, existingRatings }: HomeDramaT) => {
  const { data, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trendingDrama"],
    queryFn: fetchTrending,
    staleTime: 3600000,
    refetchOnWindowFocus: true,
  });

  const { data: tvDetails, isLoading: isTvDetailsLoading } = useQuery({
    queryKey: ["tvDetails", data?.results?.map((item: any) => item.id)],
    queryFn: async () => {
      if (!data?.results) return [];
      const tvIds = data.results.map((item: any) => item.id);
      return fetchBatchTv(tvIds);
    },
    enabled: !!data,
  });

  return (
    <HomeCard
      heading={heading}
      getDrama={getDrama}
      existingRatings={existingRatings}
      categoryData={data}
      categoryDataDetails={tvDetails}
      isDataLoading={isTrendingLoading}
      isDataDetailsLoading={isTvDetailsLoading}
      path={"tv"}
    />
  );
};

export default TrendingDrama;
