"use client";

import React from "react";
import ActorCard from "../Card/ActorCard";
import { useQuery } from "@tanstack/react-query";
import { fetchActor } from "@/app/actions/fetchMovieApi";
import { SkeletonCard } from "../Loading/HomeLoading";
const Actor = ({ heading }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["actor"],
    queryFn: fetchActor,
  });

  return (
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-center w-full h-[250px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-8 mt-0">
        {isLoading
          ? // Show loading skeletons if data is loading
            Array(20)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : data
              ?.filter((item: any) => item.profile_path !== "url(/empty.jpg)")
              ?.map((result: any, idx: any) => (
                <div key={idx} className="block w-[150px] h-[200px] mr-4">
                  <ActorCard result={result} />
                </div>
              ))}
      </div>
    </div>
  );
};

export default Actor;
