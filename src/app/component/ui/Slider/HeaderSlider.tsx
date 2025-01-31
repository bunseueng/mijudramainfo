"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "@/app/actions/fetchMovieApi";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import { useColorFromImage } from "@/hooks/useColorFromImage";

const SliderContent = dynamic(() => import("./SliderContent"), { ssr: false });
const SliderControls = dynamic(() => import("./SliderControls"), {
  ssr: false,
});

const HeaderSlider = ({ existingRatings }: any) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [colorState, setColorState] = useState({
    left: "",
    right: "",
    genreBG: "",
    center: "",
  });
  const getColorFromImage = useColorFromImage();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 3600000,
    refetchOnWindowFocus: false,
  });

  const filteredData = useMemo(
    () => trending?.results?.slice(0, 10) || [],
    [trending]
  );

  const getRating = useCallback(
    (result: any) => {
      const existingRating = existingRatings?.find(
        (item: any) => item.id === result.id
      )?.rating;
      if (existingRating) {
        return existingRating.toFixed(1);
      }
      return result.vote_average ? result.vote_average.toFixed(1) : "NR";
    },
    [existingRatings]
  );

  const handleExtractColor = useCallback(async () => {
    const currentItem = filteredData && filteredData[currentIndex];
    if (currentItem?.backdrop_path) {
      const imageUrl = `https://image.tmdb.org/t/p/${
        currentItem?.backdrop_path ? "w300" : "w92"
      }/${currentItem?.backdrop_path || currentItem?.poster_path}`;
      const [r, g, b] = await getColorFromImage(imageUrl);

      setColorState({
        left: `linear-gradient(269deg, rgba(${r}, ${g}, ${b}, 0) 1%, rgba(${r}, ${g}, ${b}, 0.02) 10%, rgba(${r}, ${g}, ${b}, 0.05) 18%, rgba(${r}, ${g}, ${b}, 0.12) 25%, rgba(${r}, ${g}, ${b}, 0.2) 32%, rgba(${r}, ${g}, ${b}, 0.29) 38%, rgba(${r}, ${g}, ${b}, 0.39) 44%, rgba(${r}, ${g}, ${b}, 0.5) 50%, rgba(${r}, ${g}, ${b}, 0.61) 57%, rgba(${r}, ${g}, ${b}, 0.71) 63%, rgba(${r}, ${g}, ${b}, 0.8) 69%, rgba(${r}, ${g}, ${b}, 0.88) 76%, rgba(${r}, ${g}, ${b}, 0.95) 83%, rgba(${r}, ${g}, ${b}, 0.98) 91%, rgb(${r}, ${g}, ${b}) 100%)`,
        right: `linear-gradient(90deg, rgba(${r}, ${g}, ${b}, 0) 1%, rgba(${r}, ${g}, ${b}, 0.02) 10%, rgba(${r}, ${g}, ${b}, 0.05) 18%, rgba(${r}, ${g}, ${b}, 0.12) 25%, rgba(${r}, ${g}, ${b}, 0.2) 32%, rgba(${r}, ${g}, ${b}, 0.29) 38%, rgba(${r}, ${g}, ${b}, 0.39) 44%, rgba(${r}, ${g}, ${b}, 0.5) 50%, rgba(${r}, ${g}, ${b}, 0.61) 57%, rgba(${r}, ${g}, ${b}, 0.71) 63%, rgba(${r}, ${g}, ${b}, 0.8) 69%, rgba(${r}, ${g}, ${b}, 0.88) 76%, rgba(${r}, ${g}, ${b}, 0.95) 83%, rgba(${r}, ${g}, ${b}, 0.98) 91%, rgb(${r}, ${g}, ${b}) 100%)`,
        genreBG: `rgb(${r}, ${g}, ${b})`,
        center: `linear-gradient(179.5deg, rgba(${r}, ${g}, ${b}, 0.88) 0%, rgba(${r}, ${g}, ${b}, 0.89) 9%, rgba(${r}, ${g}, ${b}, 0.85) 17%, rgba(${r}, ${g}, ${b}, 0.79) 24%, rgba(${r}, ${g}, ${b}, 0.72) 31%, rgba(${r}, ${g}, ${b}, 0.64) 37%, rgba(${r}, ${g}, ${b}, 0.55) 44%, rgba(${r}, ${g}, ${b}, 0.45) 50%, rgba(${r}, ${g}, ${b}, 0.35) 56%, rgba(${r}, ${g}, ${b}, 0.26) 63%, rgba(${r}, ${g}, ${b}, 0.18) 69%, rgba(${r}, ${g}, ${b}, 0.11) 76%, rgba(${r}, ${g}, ${b}, 0.05) 83%, rgba(${r}, ${g}, ${b}, 0.01) 91%, rgba(${r}, ${g}, ${b}, 0) 100%)`,
      });
    }
  }, [currentIndex, filteredData, getColorFromImage]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
  }, [filteredData]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + filteredData.length) % filteredData.length
    );
  }, [filteredData]);

  useEffect(() => {
    if (!isHovered && inView) {
      const interval = setInterval(nextSlide, 12000);
      return () => clearInterval(interval);
    }
  }, [isHovered, inView, nextSlide]);

  useEffect(() => {
    handleExtractColor();
  }, [handleExtractColor]);

  if (filteredData.length === 0) return null;

  const currentItem = filteredData[currentIndex];

  return (
    <div
      className="h-[56vw] max-h-[1012px] border-box transition duration-600 delay-400"
      style={{ background: colorState.genreBG }}
    >
      <div
        ref={ref}
        className="max-w-[1808px] mx-auto absolute left-0 right-0 w-full h-[99%]"
      >
        <SliderContent
          currentItem={currentItem}
          currentIndex={currentIndex}
          direction={direction}
          existingRatings={existingRatings}
          getRating={getRating}
          {...colorState}
        />
      </div>

      <SliderControls
        filteredData={filteredData}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        setDirection={setDirection}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        setIsHovered={setIsHovered}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />
      <div
        className="absolute bottom-0 w-full h-[30%] z-[101]"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 19, 25, 0) 2%, rgb(17, 19, 25) 94%)`,
        }}
      />
    </div>
  );
};

export default HeaderSlider;
