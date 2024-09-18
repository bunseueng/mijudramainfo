"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLatest } from "@/app/actions/fetchMovieApi";
import Link from "next/link";
import { SkeletonCard } from "../Loading/HomeLoading";
import dynamic from "next/dynamic";
const LazyImage = dynamic(() => import("@/components/ui/lazyimage"), {
  ssr: false, // If you don't need server-side rendering
});

const LatestDrama = ({ heading }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["latestDrama"],
    queryFn: fetchLatest,
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
              .filter((genre: any) => genre?.genre_ids.length > 0)
              .map((item: any, index: number) => (
                <div
                  className="block w-full h-full break-words mr-4"
                  key={index}
                >
                  <div className="block w-[150px] h-[250px] bg-cover">
                    <Link
                      prefetch={true}
                      className="block hover:relative transform duration-100 group"
                      href={`/tv/${item?.id}`}
                      style={{ width: "auto", height: "auto" }}
                    >
                      <LazyImage
                        src={item?.poster_path || item?.backdrop_path}
                        w={item?.poster_path ? "w500" : "w780"}
                        alt={item?.name || item?.title}
                        width={150}
                        height={250}
                        quality={100}
                        style={{
                          width: "auto",
                          height: "auto",
                          objectFit: "cover",
                          objectPosition: "bottom",
                        }}
                        priority
                        className="w-[150px] h-[200px] rounded-xl"
                      />
                    </Link>
                    <p className="block min-h-[20px] break-words whitespace-normal text-sm">
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
