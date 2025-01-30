"use client";

import {
  fetchEpCast,
  fetchSeasonEpisode,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import LazyImage from "@/components/ui/lazyimage";
import { tvId } from "@/helper/type";
import { useDramaData } from "@/hooks/useDramaData";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const EpisodeCast = ({ tv_id }: tvId) => {
  const { tv, isLoading } = useDramaData(tv_id);
  const [episode, setEpisode] = useState<any>();
  const router = useRouter();
  const pathParts =
    typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const season_number = pathParts[4]; // Assuming the season number is at index 4 in the path
  const episodes = pathParts[6]; // Assuming the episode  is at index 4 in the path

  const { data: castEp } = useQuery({
    queryKey: ["castEpsiode"],
    queryFn: () => fetchEpCast(tv_id, season_number, episodes),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const { data: season } = useQuery({
    queryKey: ["season"],
    queryFn: () => fetchSeasonEpisode(tv_id, season_number),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const handleNext = () => {
    const nextEpisode = parseInt(episode) + 1;
    setEpisode(nextEpisode);
    // Navigate to the next episode route
    router.push(`/tv/${tv?.id}/seasons/${season}/episode/${nextEpisode}/cast`);
  };

  const handlePrev = () => {
    const prevEpisode = parseInt(episode) - 1;
    if (prevEpisode > 1) {
      setEpisode(prevEpisode);
      // Navigate to the next episode route
      router.push(
        `/tv/${tv?.id}/seasons/${season}/episode/${prevEpisode}/cast`
      );
    } else {
      router.push(`/tv/${tv?.id}/seasons/${season}/episode/1/cast`);
    }
  };

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <div>
      <div className="bg-cyan-600">
        <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center lg:items-start">
            <LazyImage
              src={`https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w92" : "w300"
              }/${tv?.poster_path || tv?.backdrop_path}`}
              alt={`${tv?.name || tv?.title}'s Poster` || "Drama Poster"}
              width={50}
              height={50}
              quality={100}
              priority
              className="w-[90px] h-[130px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv?.id}`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
                prefetch={false}
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-b-2 border-b-slate-500 py-5 text-end">
        <p className="flex items-center justify-end text-md font-bold mr-32">
          <span className="pr-2">
            <FaArrowLeft
              className="hover:opacity-70 transform duration-300 cursor-pointer"
              onClick={handlePrev}
            />
          </span>
          Episode {episode} <span>(1x{episode})</span>
          <span className="pl-2">
            <FaArrowRight
              className="hover:opacity-70 transform duration-300 cursor-pointer"
              onClick={handleNext}
            />
          </span>
        </p>
      </div>
      <div className="max-w-[1520px] flex flex-col justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[60%]">
            <h1 className="text-2xl font-bold py-5">
              Season Regulars {castEp?.cast?.length}
            </h1>
            {castEp?.cast?.map((item: any, idx: number) => (
              <div className="flex items-center" key={idx}>
                <LazyImage
                  src={`https://image.tmdb.org/t/p/w185/${item?.profile_path}`}
                  alt={
                    `${item?.name || item?.title}'s Profile` || "Person Profile"
                  }
                  width={100}
                  height={100}
                  quality={100}
                  priority
                  className="size-[100px] bg-center object-center rounded-full my-5"
                />
                <div className="flex flex-col pl-5">
                  <p className="text-lg font-bold">{item?.name}</p>
                  <p className="text-sm font-semibold">{item?.character}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full md:w-[40%]">
            <h1 className="text-2xl font-bold py-5">
              Guest Stars {castEp?.guest_stars?.length}
            </h1>
            {castEp?.guest_stars?.length === 0 ? (
              <p>There are no cast records added to Episode {episode}.</p>
            ) : (
              <>
                {castEp?.guest_stars?.map((item: any, idx: number) => (
                  <div className="flex items-center" key={idx}>
                    <LazyImage
                      src={`https://image.tmdb.org/t/p/w185/${item?.profile_path}`}
                      alt={
                        `${item?.name || item?.title}'s Profile` ||
                        "Person Profile"
                      }
                      width={100}
                      height={100}
                      quality={100}
                      priority
                      className="size-[100px] bg-center object-center rounded-full my-5"
                    />
                    <div className="flex flex-col pl-5">
                      <p className="text-lg font-bold">{item?.name}</p>
                      <p className="text-sm font-semibold">{item?.character}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            <h1 className="text-2xl font-bold py-5">
              Crew {castEp?.crew?.length}
            </h1>
            {castEp?.crew?.length === 0 ? (
              <p>There are no crew records added to Episode {episode}.</p>
            ) : (
              <>
                {castEp?.crew?.map((item: any, idx: number) => (
                  <div className="flex items-center" key={idx}>
                    <LazyImage
                      src={`https://image.tmdb.org/t/p/w185/${item?.profile_path}`}
                      alt={
                        `${item?.name || item?.title}'s Profile` ||
                        "Person Profile"
                      }
                      width={100}
                      height={100}
                      quality={100}
                      priority
                      className="size-[100px] bg-center object-center rounded-full my-5"
                    />
                    <div className="flex flex-col pl-5">
                      <p className="text-lg font-bold">{item?.name}</p>
                      <p className="text-sm font-semibold">
                        {item?.known_for_department}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCast;
