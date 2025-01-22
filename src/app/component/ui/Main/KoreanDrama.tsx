"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchKoreanDrama, fetchTv } from "@/app/actions/fetchMovieApi";
import { HomeDramaT } from "../Main/Section";
import HomeCard from "../Card/HomeCard";

const KoreanDrama = ({ heading, getDrama, existingRatings }: HomeDramaT) => {
  const { data, isLoading: isLatestDramaLoading } = useQuery({
    queryKey: ["koreanDrama"],
    queryFn: fetchKoreanDrama,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const { data: tvDetails, isLoading: isTvDetailsLoading } = useQuery({
    queryKey: ["tvDetails", data?.results?.map((item: any) => item.id)],
    queryFn: async () => {
      if (!data?.results) return [];
      const tvPromises = data.results.map((item: any) => fetchTv(item.id));
      return Promise.all(tvPromises);
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
      isDataLoading={isLatestDramaLoading}
      isDataDetailsLoading={isTvDetailsLoading}
      path={"tv"}
    />
  );
};

export default KoreanDrama;
