"use client";

import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import { getYearFromDate } from "../../DramaMain";

interface tvId {
  tv_id: string;
}

const TvEdit: React.FC<tvId> = ({ tv_id }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  return (
    <div className="bg-cyan-600">
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center lg:items-start">
          <Image
            src={`https://image.tmdb.org/t/p/original/${
              tv?.poster_path || tv?.backdrops_path
            }`}
            alt="drama image"
            width={200}
            height={200}
            quality={100}
            className="w-[80px] h-[90px] bg-center object-center rounded-md"
          />
          <div className="flex flex-col pl-5 py-3">
            <h1 className="text-white text-2xl font-bold">
              {tv?.title || tv?.name}
            </h1>
            <h3 className="text-white text-2xl font-bold">
              ({getYearFromDate(tv?.first_air_date || tv?.release_date)})
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvEdit;
