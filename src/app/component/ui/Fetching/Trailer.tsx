"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fetchTrending, fetchVideos } from "@/app/actions/fetchMovieApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, X } from "lucide-react";
import YouTubeTrailerSkeleton from "../Loading/YoutubeLoading";

export default function YouTubeTrailer({ heading }: { heading: string }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: trending, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: trendingVideos, isLoading: isVideosLoading } = useQuery({
    queryKey: [
      "trendingVideos",
      trending?.results?.map((item: any) => item.id),
    ],
    queryFn: async () => {
      if (!trending?.results) return [];
      const videoPromises = trending.results.map((item: any) =>
        fetchVideos(item.id)
      );
      return Promise.all(videoPromises);
    },
    enabled: !!trending,
  });
  const [hoveredImageId, setHoveredImageId] = useState<any>(null);

  const handleImageHover = (imageId: any) => {
    setHoveredImageId(imageId);
  };
  const trendingWithVideos = trending?.results?.filter((result: any) => {
    const videoData = trendingVideos?.find((vid) => vid?.id === result.id);
    return videoData?.results?.length > 0;
  });

  if (isTrendingLoading || isVideosLoading) {
    return <YouTubeTrailerSkeleton heading={heading} />;
  }

  return (
    <div className="mx-auto px-4">
      <h1 className="text-xl font-bold my-2">{heading}</h1>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="relative">
          {trendingWithVideos?.map((result: any, idx: any) => (
            <div
              className="absolute inset-0 overflow-hidden rounded-lg bg-center object-cover"
              key={idx}
              style={
                hoveredImageId === result.id
                  ? {
                      backgroundImage: `url(https://image.tmdb.org/t/p/w780/${
                        result?.backdrop_path || result?.poster_path
                      })`,
                    }
                  : !hoveredImageId
                  ? {
                      backgroundImage: `url(https://image.tmdb.org/t/p/w780/${
                        result?.backdrop_path || result?.poster_path
                      })`,
                    }
                  : undefined
              }
            >
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-gradient-to-r from-[rgba(3,37,65,0.25)] via-[rgba(3,37,65,0.20)] to-[rgba(3,37,65,0.25)] bg-opacity-75"></div>
            </div>
          ))}
          <div className="flex space-x-4 p-4">
            {trendingWithVideos?.map((result: any) => {
              const correspondingVideo = trendingVideos?.find(
                (vid) => vid?.id === result.id
              );
              const videoKey = correspondingVideo?.results?.[0]?.key;

              return (
                <Card key={result.id} className="w-[250px] flex-shrink-0">
                  <CardContent className="p-0">
                    <div
                      className="relative h-[140px] overflow-hidden rounded-t-lg"
                      onMouseEnter={() => handleImageHover(result.id)}
                      onMouseLeave={() => handleImageHover(null)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${
                          result.backdrop_path || result.poster_path
                        }`}
                        alt={result.title || result.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      {videoKey && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                          onClick={() => setSelectedVideo(videoKey)}
                        >
                          <Play className="h-6 w-6 text-white dark:text-base" />
                        </Button>
                      )}
                    </div>
                    <div className="relative top-0 overflow-hidden px-2">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {result.title || result.name}
                      </h3>
                      <p className="text-sm text-white opacity-50 dark:text-gray-300 dark:opacity-100">
                        {result.release_date || result.first_air_date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
