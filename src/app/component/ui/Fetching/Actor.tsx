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
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data
          ?.filter((item: any) => item.profile_path !== "url(/empty.jpg)")
          ?.map((result: any, idx: any) => (
            <div key={idx}>
              <ActorCard result={result} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Actor;
