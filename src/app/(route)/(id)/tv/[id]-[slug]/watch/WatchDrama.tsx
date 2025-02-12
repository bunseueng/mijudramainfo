"use client";

import React, { useState } from "react";
import { EpisodeList } from "./EpisodeList";
import { useDramaData } from "@/hooks/useDramaData";
import type { DramaDB, DramaDetails, TVShow } from "@/helper/type";
import { Info } from "lucide-react";
import { countryToNationalityMap } from "@/helper/item-list";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import WatchInfo from "@/app/component/ui/Watch/WatchInfo";
import VideoPlayer from "@/app/component/ui/Watch/VideoPlayer";
import CastSection from "@/app/component/ui/Watch/CastSection";
import RelatedContent from "@/app/component/ui/Watch/RelatedContent";
import { useQuery } from "@tanstack/react-query";
import { fetchRatings } from "@/app/actions/fetchMovieApi";

interface WatchDramaProps {
  tv_id: string;
  getDrama: DramaDB | null;
}

const WatchDrama = ({ tv_id, getDrama }: WatchDramaProps) => {
  const { tv, isLoading } = useDramaData(tv_id);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const related_content = tv?.similar?.results as TVShow[];
  const [detail]: DramaDetails[] = (getDrama?.details ||
    []) as unknown as DramaDetails[];

  const { data: rating_db } = useQuery({
    queryKey: ["ratings", tv_id],
    queryFn: () => fetchRatings([tv_id.toString()]), // ✅ Pass id as a string array
  });
  const findRatingDB = rating_db?.filter(
    (p: any) => p.tvId || p.movieId === tv_id
  );
  const averageRating = findRatingDB
    ? findRatingDB.reduce(
        (sum: number, rating: any) => sum + rating.rating,
        0
      ) / findRatingDB.length
    : 0;

  const episodes = React.useMemo(() => {
    if (!tv?.number_of_episodes) return [];
    return Array.from({ length: tv.number_of_episodes }, (_, i) => ({
      id: i + 1,
      title: `Episode ${i + 1}`,
      duration:
        tv?.episode_run_time?.length > 0 && `${tv?.episode_run_time[0]} mins`,
      thumbnail:
        `https://image.tmdb.org/t/p/${tv?.backdrop_path ? "w300" : "w185"}/${
          tv?.backdrop_path || tv?.poster_path
        }` || "/placeholder-image.avif",
    }));
  }, [
    tv?.number_of_episodes,
    tv?.poster_path,
    tv?.backdrop_path,
    tv?.episode_run_time,
  ]);

  const videoUrl = React.useMemo(() => {
    return `https://player.embed-api.stream/?id=${tv_id}&s=1&e=${currentEpisode}`;
  }, [tv_id, currentEpisode]);

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
      <div
        className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 my-4 rounded-md shadow-sm"
        role="alert"
        aria-live="polite"
      >
        <div className="flex-shrink-0 pr-2">
          <Info
            className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 text-sm md:text-base text-yellow-800 dark:text-yellow-200">
          If the video is unavailable or doesn&apos;t match the title, try
          switching to another server. Some servers may provide incorrect
          videos. 😥
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <VideoPlayer videoUrl={videoUrl} />
          <div className="lg:hidden">
            <EpisodeList
              episodes={episodes}
              currentEpisode={currentEpisode}
              onEpisodeSelect={(episodeId) => setCurrentEpisode(episodeId)}
            />
          </div>
          <WatchInfo
            id={tv?.id}
            title={detail?.title || tv?.name}
            description={
              detail?.synopsis ||
              tv?.overview ||
              "This drama does not have synopsis yet."
            }
            genres={tv?.genres?.map((data: any) => data?.name)}
            year={tv?.first_air_date}
            episodes={tv?.number_of_episodes}
            rating={
              tv && tv.vote_average && averageRating
                ? (
                    (tv.vote_average * tv.vote_count +
                      averageRating * averageRating) /
                    (tv.vote_count + averageRating)
                  ).toFixed(1) // Apply toFixed(1) to the entire expression
                : averageRating
                ? averageRating.toFixed(1)
                : tv && tv.vote_average.toFixed(1)
            }
            duration={tv?.episode_run_time[0] || "Duration not yet available"}
            type={`${getNationality(tv?.type[0])} Drama`}
            imageUrl={
              getDrama?.cover ||
              `https://image.tmdb.org/t/p/${
                tv?.backdrop_path ? "w780" : "w342"
              }/${tv?.backdrop_path || tv?.poster_path}`
            }
            link="tv"
          />
          <CastSection
            cast={tv?.credits?.cast || []}
            tv_id={tv?.id}
            type="tv"
          />
          <div className="w-full h-[250px] my-10">
            <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="hidden lg:block">
            <EpisodeList
              episodes={episodes}
              currentEpisode={currentEpisode}
              onEpisodeSelect={(episodeId) => setCurrentEpisode(episodeId)}
            />
          </div>

          <div className="flex flex-col gap-6 my-10">
            <div className="w-full order-first md:order-last">
              <RelatedContent related_content={related_content} type="tv" />
            </div>
            <div className="h-[200px] order-last md:order-first">
              <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WatchDrama;
