"use client";

import React from "react";
import ActorCard from "../Card/ActorCard";
import { useQuery } from "@tanstack/react-query";
import { fetchActor } from "@/app/actions/fetchMovieApi";

const Actor = ({ heading }: any) => {
  const { data } = useQuery({
    queryKey: ["actor"],
    queryFn: fetchActor,
  });

  return (
    <div className="relative top-0 left-0 mt-5 overflow-hidden">
      <h1 className="text-3xl font-bold my-5">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data
          ?.filter((item: any) => item.profile_path !== "url(/empty.jpg)")
          ?.map((result: any, idx: any) => (
            <div className="w-[200px] h-[280px] mr-8" key={idx}>
              <ActorCard result={result} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Actor;
