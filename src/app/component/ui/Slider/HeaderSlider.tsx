"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrailer, fetchTrending } from "@/app/actions/fetchMovieApi";
import { motion, AnimatePresence } from "framer-motion";
import Images from "next/image";
import { ITmdbDrama } from "@/helper/type";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import HeroSkeletonLoading from "../Loading/HeroSkeletonLoading";
import { getTextColor } from "@/app/actions/getTextColor";
import Link from "next/link";
import ColorThief from "colorthief";

const HeaderSlider = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [dominantColorBot, setDominantColorBot] = useState<string | null>(null);
  const [extractDeg, setExtractDeg] = useState<string | null>(null);
  const [rgbColor, setRgbColor] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const { data: trending, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 3600000,
    refetchOnWindowFocus: true,
  });

  const filteredData = useMemo(
    () => trending?.results?.slice(0, 10) || [],
    [trending]
  );

  const getColorFromImage = useCallback((imageUrl: string) => {
    return new Promise<[number, number, number]>((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        resolve(color);
      };
    });
  }, []);

  const getTextColor = useCallback((r: number, g: number, b: number) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  }, []);

  const handleExtractColor = useCallback(async () => {
    const currentItem = filteredData && filteredData[currentIndex];
    if (currentItem?.backdrop_path) {
      const imageUrl = `https://image.tmdb.org/t/p/w300/${currentItem.backdrop_path}`;
      const [r, g, b] = await getColorFromImage(imageUrl);

      setRgbColor(`rgb(${r}, ${g}, ${b})`);

      const startColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
      const endColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
      const startColorBot = `rgba(${r}, ${g}, ${b}, 0.7)`;
      const endColorBot = `rgba(${r}, ${g}, ${b}, 0)`;
      const newTextColor = getTextColor(r, g, b);
      setTextColor(newTextColor);

      const gradientBackground = `linear-gradient(${startColor}, ${endColor})`;
      const gradientBackgroundBot = `linear-gradient(${startColorBot}, ${endColorBot})`;
      const gradientBackground270 = `linear-gradient(270deg, rgb(${r}, ${g}, ${b}) 0%, transparent)`;

      setDominantColor(gradientBackground);
      setDominantColorBot(gradientBackgroundBot);
      setExtractDeg(gradientBackground270);
    }
  }, [currentIndex, filteredData, getColorFromImage, getTextColor]);

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

  const handleMouseOver = useCallback(
    (index: number): void => {
      setHoveredIndex(index);
      setIsHovered(true);
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const handleMouseLeave = useCallback((): void => {
    setIsHovered(false);
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    if (!isHovered && inView) {
      const interval = setInterval(() => {
        setDirection(1);
        nextSlide();
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isHovered, inView, nextSlide]);

  useEffect(() => {
    handleExtractColor();
  }, [handleExtractColor]);

  if (isLoading || filteredData.length === 0) return <HeroSkeletonLoading />;

  const currentItem = filteredData[currentIndex];

  return (
    <div
      ref={ref}
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-black"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{
            opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
            x: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Images
              src={`https://image.tmdb.org/t/p/original/${
                currentItem.backdrop_path || currentItem.poster_path
              }`}
              alt={currentItem.name || currentItem.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={100}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 h-full w-[30%] lg:w-[540px] -left-1 -rotate-180"
              style={{ backgroundImage: extractDeg as string }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 h-full w-[30%] lg:w-[540px] -right-1"
              style={{ backgroundImage: extractDeg as string }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 w-full h-[15vh] lg:h-[174px]"
            >
              <div
                className="h-[20%] lg:h-[64px]"
                style={{ backgroundImage: dominantColor as string }}
              />
              <div
                className="h-[80%] lg:h-[110px]"
                style={{ backgroundImage: dominantColorBot as string }}
              />
            </motion.div>
            <div
              className="absolute bottom-0 w-full h-[20vh] lg:h-[230px]"
              style={{
                backgroundImage: "linear-gradient(0deg,#14161a,transparent)",
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 top-1/2 flex items-center justify-between px-4 md:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-500"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-500"
          aria-label="Next slide"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute bottom-16 left-0 right-0 w-full max-w-7xl px-4 md:px-16 mx-auto z-[9999]">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-left max-w-3xl"
        >
          <h2
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: textColor }}
          >
            {currentItem.name || currentItem.title}
          </h2>
          <p
            className="text-lg md:text-xl mb-6 line-clamp-3"
            style={{ color: textColor }}
          >
            {currentItem.overview}
          </p>
          <div className="flex flex-wrap gap-4 z-50">
            <Button
              size="lg"
              className="rounded-full px-8 bg-green-500 text-white hover:bg-green-600 transition-all duration-500"
            >
              <Link
                href={`/tv/${currentItem.id}?success=true`}
                className="flex items-center"
              >
                <Play className="mr-2 h-5 w-5" /> Watch Now
              </Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full px-8 border-gray-700 text-white hover:bg-gray-200 hover:text-gray-700 transition-all duration-500"
            >
              <Link
                href={`/tv/${currentItem.id}`}
                className="flex items-center"
              >
                <Info className="mr-2 h-5 w-5" /> More Info
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="flex justify-start space-x-2 mt-8">
          {filteredData.map((tv: ITmdbDrama, index: number) => (
            <motion.button
              key={tv.id}
              initial={{ opacity: 0.7, scale: 0.8 }}
              animate={{
                opacity:
                  hoveredIndex === index || currentIndex === index ? 1 : 0.7,
                scale:
                  hoveredIndex === index || currentIndex === index ? 1 : 0.8,
              }}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-500",
                hoveredIndex === index || currentIndex === index
                  ? "bg-white"
                  : "bg-white/50"
              )}
              onMouseEnter={() => handleMouseOver(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderSlider;
