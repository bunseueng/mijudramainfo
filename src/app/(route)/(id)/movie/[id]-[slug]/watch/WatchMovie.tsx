"use client";

import React, { useState } from "react";
import type { DramaDetails, MovieDB, TVShow } from "@/helper/type";
import { Info } from "lucide-react";
import { countryToNationalityMap } from "@/helper/item-list";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import WatchInfo from "@/app/component/ui/Watch/WatchInfo";
import VideoPlayer from "@/app/component/ui/Watch/VideoPlayer";
import CastSection from "@/app/component/ui/Watch/CastSection";
import RelatedContent from "@/app/component/ui/Watch/RelatedContent";
import { useMovieData } from "@/hooks/useMovieData";

interface WatchMovieProps {
  movie_id: string;
  getMovie: MovieDB | null;
}

const WatchMovie = ({ movie_id, getMovie }: WatchMovieProps) => {
  const { movie, isLoading } = useMovieData(movie_id);
  const related_content = movie?.similar?.results as TVShow[];
  const [detail]: DramaDetails[] = (getMovie?.details ||
    []) as unknown as DramaDetails[];

  const videoUrl = React.useMemo(() => {
    return `https://player.embed-api.stream/?id=${movie_id}`;
  }, [movie_id]);

  const getNationality = (type: string) => {
    if (!type) return "";

    const parts = type.split(", ");
    const country = parts[parts.length - 1].trim();

    if ((countryToNationalityMap as Record<string, string>)[country]) {
      return (countryToNationalityMap as Record<string, string>)[country];
    }

    const countryKeys = Object.keys(countryToNationalityMap);
    const matchingKey = countryKeys.find(
      (key) =>
        country.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(country.toLowerCase())
    );

    return matchingKey
      ? (countryToNationalityMap as Record<string, string>)[matchingKey]
      : "";
  };

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <main className="max-w-[1808px] mx-auto px-4 py-6">
      <div className="flex items-center bg-red-400 my-4 p-4 rounded-md">
        <div className="pr-1">
          <Info />
        </div>
        <div className="text-sm md:text-md">
          If video is not available, try switching to another server.
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <VideoPlayer videoUrl={videoUrl} />
          <WatchInfo
            id={movie?.id}
            title={detail?.title || movie?.name || movie?.title}
            description={
              detail?.synopsis ||
              movie?.overview ||
              "This drama does not have synopsis yet."
            }
            genres={movie?.genres?.map((data: any) => data?.name)}
            year={movie?.release_date}
            episodes={0}
            rating={movie?.vote_average}
            duration={movie?.runtime || "Duration not yet available"}
            type={`${getNationality(movie?.type[0])} Movie`}
            imageUrl={
              getMovie?.cover ||
              `https://image.tmdb.org/t/p/${
                movie?.backdrop_path ? "w780" : "w342"
              }/${movie?.backdrop_path || movie?.poster_path}`
            }
            link="movie"
          />
          <CastSection
            cast={movie?.credits?.cast || []}
            tv_id={movie?.id}
            type="movie"
          />
          <div className="w-full h-[250px] my-10">
            <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>
        <div className="flex flex-col gap-6 my-10">
          <div className="w-full order-first md:order-last">
            <RelatedContent related_content={related_content} type="movie" />
          </div>
          <div className="h-[200px] order-last md:order-first">
            <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default WatchMovie;
