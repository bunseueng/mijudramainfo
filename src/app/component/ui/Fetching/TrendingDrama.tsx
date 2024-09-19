"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "@/app/actions/fetchMovieApi";
import Link from "next/link";
import { SkeletonCard } from "../Loading/HomeLoading";
import LazyImage from "@/components/ui/lazyimage";

const TrendingDrama = ({ heading }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["trendingDrama"],
    queryFn: fetchTrending,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-center w-full h-full overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {isLoading
          ? // Show loading skeletons if data is loading
            Array(20)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : data?.results
              ?.filter(
                (item: any) => item?.poster_path || item?.backdrop_path !== null
              )
              .map((result: any, index: any) => (
                <div
                  className="block w-full h-full break-words mr-4"
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
                        src={result?.poster_path || result?.backdrop_path}
                        w={result?.poster_path ? "w500" : "w780"}
                        alt={result?.name || result?.title}
                        width={150}
                        height={250}
                        quality={100}
                        priority
                        style={{
                          objectFit: "cover",
                          objectPosition: "bottom",
                        }}
                        className="w-[150px] h-[200px] rounded-xl bg-center"
                      />
                    </Link>
                    <p className="block min-h-[20px] break-words whitespace-normal text-sm">
                      {result?.name || result?.title}
                    </p>

                    <p className="text-sm text-muted-foreground opacity-70 dark:opacity-80">
                      {result?.first_air_date !== "" ? (
                        result?.first_air_date?.split("-")[0]
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

export default TrendingDrama;
