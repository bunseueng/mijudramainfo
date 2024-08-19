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
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data?.results
          ?.filter(
            (item: any) => item?.poster_path || item?.backdrop_path !== null
          )
          .filter((genre: any) => genre?.genre_ids.length > 0)
          .map((item: any, index: number) => (
            <div
              className="block w-[150px] h-[250px] break-words mr-4"
              key={index}
            >
              <div className="block w-[150px] h-[250px] bg-cover">
                <Link
                  className="block hover:relative transform duration-100 group"
                  href={`/tv/${item?.id}`}
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
                      className="rounded-xl w-[150px] h-[200px] object-cover"
                    />
                  ) : (
                    <Image
                      src="/empty-img.jpg"
                      alt={item?.name || item?.title}
                      width={600}
                      height={600}
                      quality={100}
                      className="rounded-xl w-[150px] h-[200px] object-cover"
                    />
                  )}
                </Link>
                <p className="block break-words whitespace-normal text-sm">
                  {item?.name || item?.title}
                </p>
                <p className="text-sm text-muted-foreground opacity-70 dark:opacity-80">
                  {item?.first_air_date !== "" ? (
                    item?.first_air_date?.split("-")[0]
                  ) : (
                    <span className="text-[#2490da]">Upcoming</span>
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LatestDrama;
