"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJapaneseDrama, fetchTv } from "@/app/actions/fetchMovieApi";
import HomeCard from "../Card/HomeCard";
import { HomeDramaT } from "../Main/Section";

const JapaneseDrama = ({ heading, getDrama, existingRatings }: HomeDramaT) => {
  const { data, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["JapaneseDrama"],
    queryFn: fetchJapaneseDrama,
    staleTime: 3600000,
    refetchOnWindowFocus: true,
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
      isDataLoading={isTrendingLoading}
      isDataDetailsLoading={isTvDetailsLoading}
      path={"tv"}
    />
  );
};

export default JapaneseDrama;
