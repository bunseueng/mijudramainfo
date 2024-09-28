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
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  return (
    <div className="relative top-0 left-0 mt-5 mx-4 md:mx-6 overflow-hidden">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <div className="flex items-start w-full h-full overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {isLoading
          ? // Show loading skeletons if data is loading
            Array(8)
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
                      shallow
                      href={`/tv/${result?.id}`}
                      className="block hover:relative transform duration-100 group"
                      style={{ width: "auto", height: "auto" }}
                    >
                      <LazyImage
                        src={result?.poster_path || result?.backdrop_path}
                        w={result?.poster_path ? "w500" : "w780"}
                        alt={result?.name || result?.title}
                        width={150}
                        height={200}
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (min-width: 1024px) 50vw, 150px"
                        priority
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
              ))}
      </div>
    </div>
  );
};

export default TrendingDrama;
