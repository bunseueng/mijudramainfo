"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { video } from "@/helper/VideoData";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending, fetchVideos } from "@/app/actions/fetchMovieApi";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const HeaderSlider = () => {
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { data: trendingVideos, isLoading } = useQuery({
    queryKey: [
      "trendingVideos",
      trending?.results?.map((item: any) => item.id),
    ],
    queryFn: async () => {
      if (!trending?.results) return [];
      // Fetch videos for each trending ID
      const videoPromises = trending.results.map((item: any) =>
        fetchVideos(item.id)
      );
      return Promise.all(videoPromises);
    },
    enabled: !!trending, // Ensure trending data is fetched before running this query
  });

  const filteredVideo = trendingVideos
    ?.filter((vid) => vid?.results?.length > 0)
    ?.slice(0, 4);
  const nextSlide = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % video.length);
  }, []);

  const prevSlide = useCallback((): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + video.length) % video.length
    );
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 50000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isHovered, nextSlide]);

  const handleMouseOver = (): void => {
    setIsHovered(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  if (isLoading) {
    return <div>Fetching Data...</div>;
  }
  return (
    <div
      className="sliderContainer relative"
      id={`${filteredVideo?.[currentIndex]?.id}`}
    >
      <div
        className="slider relative"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        {/* Position title at the top left of the video */}
        <p className="absolute top-2 left-2 z-10 text-xs md:text-sm text-white bg-black bg-opacity-50 p-2 rounded">
          {filteredVideo?.[currentIndex]?.results[0]?.name}
        </p>
        <div className="video-player">
          <ReactPlayer
            url={`https://www.youtube.com/embed/${filteredVideo?.[currentIndex]?.results[0]?.key}`}
            width="100%" // Full width
            height="100%" // Full height
            controls={false}
            autoPlay
            loop={false} // Set to false to play once
            playing
            muted
            onEnded={nextSlide} // Move to the next video when the current one ends
            config={{
              vimeo: {
                playerOptions: {
                  quality: "2160p", // Set the preferred quality, e.g., '1080p', '720p'
                },
              },
            }}
          />
        </div>
      </div>
      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button name="Prev Arrow" onClick={prevSlide}>
          <BsFillArrowLeftCircleFill />
        </button>
        <button name="Next Arrow" onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>
      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {filteredVideo?.map((_, index) => (
          <div
            key={index}
            className={`rounded-full w-5 h-5 cursor-pointer ${
              index === currentIndex
                ? "bg-[#beff46] rounded-xl"
                : "bg-gray-300 rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
