"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "@/app/actions/fetchMovieApi";
import ColorThief from "colorthief";
import { motion } from "framer-motion";
import Image from "next/image";
import { ITmdbDrama } from "@/helper/type";
import Link from "next/link";
import HeroSkeletonLoading from "../Loading/HeroLoading";

const HeaderSlider = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [dominantColorBot, setDominantColorBot] = useState<string | null>(null);
  const [extractDeg, setExtractDeg] = useState<string | null>(null);
  const [rgbColor, setRgbColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null); // Ref on container instead
  const { data: trending, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const filteredData = trending?.results?.slice(0, 10);
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData?.length);
  }, [filteredData]);

  const handleMouseOver = (index: number): void => {
    setHoveredIndex(index);
    setIsHovered(true);
    // Set currentIndex to the hovered item
    setCurrentIndex(index);
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setHoveredIndex(null);
  };

  const extractColor = () => {
    if (imgRef.current) {
      const imgElement = imgRef.current.querySelector(
        "img"
      ) as HTMLImageElement;
      if (imgElement) {
        const colorThief = new ColorThief();
        const color = colorThief?.getColor(imgElement);

        if (color) {
          const [r, g, b] = color; // Destructure RGB values
          // Create RGB color
          const rgbColor = `rgb(${r}, ${g}, ${b})`;
          // Create two RGBA colors with different alpha values
          const startColor = `rgba(${r}, ${g}, ${b}, 0.9)`; // Start color with alpha 0.9
          const endColor = `rgba(${r}, ${g}, ${b}, 0.7)`; // End color with alpha 0.7
          const startColorBot = `rgba(${r}, ${g}, ${b}, 0.7)`; // Start color with alpha 0.9
          const endColorBot = `rgba(${r}, ${g}, ${b}, 0)`; // End color with alpha 0.7

          // Create a linear gradient with the extracted colors
          const gradientBackground = `linear-gradient(${startColor}, ${endColor})`;
          const gradientBackgroundBot = `linear-gradient(${startColorBot}, ${endColorBot})`;
          const gradientBackground270 = `linear-gradient(270deg, rgb(${r}, ${g}, ${b}) 0%, transparent)`;

          // Set the dominant color as the gradient
          setRgbColor(rgbColor);
          setDominantColor(gradientBackground);
          setDominantColorBot(gradientBackgroundBot);
          setExtractDeg(gradientBackground270);
        }
      }
    }
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isHovered, nextSlide]);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex % filteredData?.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isHovered, filteredData]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current.querySelector(
        "img"
      ) as HTMLImageElement;
      if (imgElement) {
        imgElement.addEventListener("load", extractColor);
        return () => {
          imgElement.removeEventListener("load", extractColor);
        };
      }
    }
  }, [currentIndex]); // Trigger when the current slide changes

  if (isLoading || !trending?.results) return <HeroSkeletonLoading />;
  const currentItem = filteredData[currentIndex];

  return (
    <div className="sticky top-0 z-0 h-[60vh] lg:h-[586px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: rgbColor as string,
        }}
      >
        <div
          className="min-[1500px]:max-w-[1224px] min-[2000px]:max-w-[1736px] h-full relative mx-auto overflow-hidden bg-[#14161a]"
          ref={imgRef}
        >
          <ul className="relative w-full h-full">
            <li className="absolute bottom-0 top-0 left-0 w-full h-full">
              <Image
                src={`https://image.tmdb.org/t/p/original/${currentItem?.backdrop_path}`}
                alt={currentItem?.name || currentItem?.title}
                width={1736}
                height={670}
                quality={100}
                sizes="(max-width: 768px) 100vw, (min-width: 1024px) 50vw, 100vw"
                priority
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </li>
          </ul>
          <div
            className="absolute top-0 h-full w-[30%] lg:w-[540px] -left-1 -rotate-180"
            style={{
              backgroundImage: extractDeg as string,
            }}
          ></div>
          <div
            className="absolute top-0 h-full w-[30%] lg:w-[540px] -right-1"
            style={{
              backgroundImage: extractDeg as string,
            }}
          ></div>
        </div>

        <div className="absolute top-0 w-full h-[15vh] lg:h-[174px]">
          <div
            className="h-[20%] lg:h-[64px]"
            style={{
              backgroundImage: dominantColor as string,
            }}
          ></div>
          <div
            className="h-[80%] lg:h-[110px]"
            style={{
              backgroundImage: dominantColorBot as string,
            }}
          ></div>
        </div>
        <div
          className="absolute bottom-0 w-full h-[20vh] lg:h-[230px]"
          style={{
            backgroundImage: "linear-gradient(0deg,#14161a,transparent)",
          }}
        ></div>
        <div className="w-[1196px] absolute top-[64px] bottom-0 right-10 md:right-24 overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="w-full lg:min-w-[305px] h-[488px] pt-6">
              {filteredData?.map((tv: ITmdbDrama, index: number) => (
                <motion.div
                  key={tv?.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity:
                      hoveredIndex === index || currentIndex === index
                        ? 1
                        : 0.5,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`relative overflow-hidden transition-all duration-500 ease-out -mt-2${
                    hoveredIndex === index || currentIndex === index
                      ? "bg-headerTitle opacity-100 font-bold"
                      : "bg-transparent opacity-80"
                  }`}
                  onMouseEnter={() => handleMouseOver(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    prefetch={true}
                    href={`/tv/${currentItem?.id}`}
                    className={`text-xs sm:text-sm lg:text-md text-right float-right text-white py-1 sm:py-2 px-2 sm:px-3 lg:px-4 ${
                      hoveredIndex === index || currentIndex === index
                        ? "font-bold opacity-100"
                        : "opacity-80"
                    }`}
                  >
                    {tv?.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSlider;
