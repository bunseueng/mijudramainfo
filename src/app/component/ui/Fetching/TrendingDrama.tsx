"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "@/app/actions/fetchMovieApi";
import Link from "next/link";
import { SkeletonCard } from "../Loading/HomeLoading";
import LazyImage from "@/components/ui/lazyimage";
import { DramaDB } from "@/helper/type";

type TrendingDramaT = {
  heading: string;
  getDrama: DramaDB[];
};

const TrendingDrama = ({ heading, getDrama }: TrendingDramaT) => {
  const { data, isLoading } = useQuery({
    queryKey: ["trendingDrama"],
    queryFn: fetchTrending,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
  });

  return (
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-start w-full h-full overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : data?.results
              ?.filter(
                (item: any) => item?.poster_path || item?.backdrop_path !== null
              )
              .map((result: any, index: any) => {
                const coverFromDB = getDrama?.find((d: any) =>
                  d?.tv_id?.includes(result?.id)
                );
                return (
                  <div
                    className={`block w-full h-full break-words ${
                      index === data?.results?.length - 1 ? "mr-0" : "mr-4"
                    }`}
                    key={index}
                  >
                    <div className="block w-[150px] h-[250px] bg-cover">
                      <Link
                        prefetch={true}
                        href={`/tv/${result?.id}`}
                        className="block hover:relative transform duration-100 group"
                        style={{ width: "auto", height: "auto" }}
                      >
                        <LazyImage
                          coverFromDB={coverFromDB?.cover}
                          src={result?.poster_path || result?.backdrop_path}
                          w={result?.poster_path ? "w500" : "w780"}
                          alt={result?.name || result?.title}
                          width={150}
                          height={200}
                          quality={75}
                          sizes="(max-width: 768px) 100vw, (min-width: 1024px) 150px"
                          priority={index < 2} // Prioritize loading first two images
                          className="aspect-[150/200] rounded-xl bg-center object-cover"
                        />
                      </Link>
                      <h2 className="mt-2 text-xs font-medium line-clamp-2 truncate">
                        {result?.name || result?.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result?.first_air_date ? (
                          result.first_air_date.split("-")[0]
                        ) : (
                          <span className="text-[#2490da]">Upcoming</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default TrendingDrama;
