"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLatest } from "@/app/actions/fetchMovieApi";
import Link from "next/link";
import Image from "next/image";

const LatestDrama = ({ heading }: any) => {
  const { data } = useQuery({
    queryKey: ["latestDrama"],
    queryFn: fetchLatest,
  });
  return (
    <div className="relative top-0 left-0 mt-5 overflow-hidden">
      <h1 className="text-3xl font-bold my-5">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data?.results
          ?.filter(
            (item: any) => item?.poster_path || item?.backdrop_path !== null
          )
          .filter((genre: any) => genre?.genre_ids.length > 0)
          .map((item: any, index: number) => (
            <div className="w-[200px] h-[280px] mr-8" key={index}>
              <div className="w-[200px] h-[280px] bg-cover">
                <Link
                  href={`/tv/${item?.id}`}
                  className="block hover:relative transform duration-100 group"
                >
                  {item?.poster_path || item?.backdrop_path !== null ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${
                        item?.poster_path || item?.backdrop_path
                      }`}
                      alt={item?.name || item?.title}
                      width={600}
                      height={600}
                      quality={100}
                      className="rounded-xl w-[200px] h-[250px] object-cover"
                    />
                  ) : (
                    <Image
                      src="/empty-img.jpg"
                      alt={item?.name || item?.title}
                      width={600}
                      height={600}
                      quality={100}
                      className="rounded-xl w-[200px] h-[250px] object-cover"
                    />
                  )}
                </Link>
                <div className="flex items-center justify-between">
                  <p className="truncate">{item?.name || item?.title}</p>
                  <p>{Math.round(item?.vote_average * 10)}%</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LatestDrama;
