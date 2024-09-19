"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActor } from "@/app/actions/fetchMovieApi";
import { SkeletonCard } from "../Loading/HomeLoading";
import ActorCard from "../Card/ActorCard";
const Actor = ({ heading }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["actor"],
    queryFn: fetchActor,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-center w-full h-full overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-8 mt-0">
        {isLoading
          ? // Show loading skeletons if data is loading
            Array(20)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : data
              ?.filter(
                (item: any) =>
                  item.profile_path !== "url(/placeholder-image.avif)"
              )
              ?.map((result: any, idx: any) => (
                <div key={idx} className="block w-full h-full mr-4">
                  <ActorCard result={result} />
                </div>
              ))}
      </div>
    </div>
  );
};

export default Actor;
