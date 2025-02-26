"use client";

import React, { useState } from "react";
import type { DramaDetails, MovieDB, TVShow } from "@/helper/type";
import { Info, Subtitles } from "lucide-react";
import { countryToNationalityMap } from "@/helper/item-list";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import WatchInfo from "@/app/component/ui/Watch/WatchInfo";
import VideoPlayer from "@/app/component/ui/Watch/VideoPlayer";
import CastSection from "@/app/component/ui/Watch/CastSection";
import RelatedContent from "@/app/component/ui/Watch/RelatedContent";
import { useMovieData } from "@/hooks/useMovieData";
import { fetchRatings } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WatchMovieProps {
  movie_id: string;
  getMovie: MovieDB | null;
}

type VideoSource = {
  id: string;
  name: string;
  getUrl: (movieId: string) => string;
};

const VIDEO_SOURCES: VideoSource[] = [
  {
    id: "default",
    name: "RGShows",
    getUrl: (movieId) => `https://embed.rgshows.me/api/1/movie/?id=${movieId}`,
  },
  {
    id: "vidapi",
    name: "Vidapi",
    getUrl: (movieId) => `https://vidapi.click/embed/movie/${movieId}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    getUrl: (movieId) =>
      `https://vidlink.pro/movie/${movieId}?primaryColor=ff0044&secondaryColor=f788a6&iconColor=ff0044&title=false&poster=true&autoplay=false`,
  },
  {
    id: "videasy",
    name: "Videasy",
    getUrl: (movieId) => `https://player.videasy.net/movie/${movieId}`,
  },
  {
    id: "vidbinge",
    name: "VidBinge",
    getUrl: (movieId) => `https://vidbinge.dev/embed/movie/${movieId}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getUrl: (movieId) => `https://player.autoembed.cc/embed/movie/${movieId}`,
  },
];

const WatchMovie = ({ movie_id, getMovie }: WatchMovieProps) => {
  const { movie, isLoading } = useMovieData(movie_id);
  const [currentSource, setCurrentSource] = useState<string>("default");
  const related_content = movie?.similar?.results as TVShow[];
  const [detail]: DramaDetails[] = (getMovie?.details ||
    []) as unknown as DramaDetails[];

  const { data: rating_db } = useQuery({
    queryKey: ["ratings", movie_id],
    queryFn: () => fetchRatings([movie_id.toString()]),
    staleTime: 3600000,
    gcTime: 3600000,
  });

  const findRatingDB = rating_db?.filter(
    (p: any) => p.tvId || p.movieId === movie_id
  );
  const averageRating = findRatingDB
    ? findRatingDB.reduce(
        (sum: number, rating: any) => sum + rating.rating,
        0
      ) / findRatingDB.length
    : 0;

  const videoUrl = React.useMemo(() => {
    const source = VIDEO_SOURCES.find((s) => s.id === currentSource);
    return source ? source.getUrl(movie_id) : "";
  }, [movie_id, currentSource]);

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
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Video Availability</AlertTitle>
        <AlertDescription>
          If the video is unavailable or doesn&apos;t match the title, try
          switching to another server. Some servers may provide incorrect
          videos.
        </AlertDescription>
      </Alert>
      <Alert variant="default" className="mb-6">
        <Subtitles className="h-4 w-4" />
        <AlertTitle>Video Source</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            If the video doesn&apos;t load or you encounter issues, try another
            video provider from the dropdown.
          </span>
          <Select value={currentSource} onValueChange={setCurrentSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_SOURCES.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AlertDescription>
      </Alert>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <VideoPlayer videoUrl={videoUrl} />
          <WatchInfo
            id={movie?.id}
            title={detail?.title || movie?.name || movie?.title}
            description={
              detail?.synopsis ||
              movie?.overview ||
              "This movie does not have a synopsis yet."
            }
            genres={movie?.genres?.map((data: any) => data?.name)}
            year={movie?.release_date}
            episodes={0}
            rating={
              movie && movie.vote_average && averageRating
                ? (
                    (movie.vote_average * movie.vote_count +
                      averageRating * averageRating) /
                    (movie.vote_count + averageRating)
                  ).toFixed(1)
                : averageRating
                ? averageRating.toFixed(1)
                : movie && movie.vote_average.toFixed(1)
            }
            duration={
              movie?.runtime
                ? `${movie.runtime} mins`
                : "Duration not yet available"
            }
            type={`${getNationality(movie?.type?.[0] || "")} Movie`}
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
