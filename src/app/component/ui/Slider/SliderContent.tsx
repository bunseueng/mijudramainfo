"use client";

import React, { useMemo, useEffect, useState } from "react";
import Images from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import dynamic from "next/dynamic";
import { fetchRatings } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";

const DynamicOptimizedContentWrapper = dynamic(
  () => import("./OptimizedContentWrapper"),
  { ssr: false }
);
const DynamicGradientOverlays = dynamic(() => import("./GradientOverlays"), {
  ssr: false,
});

interface SliderContentProps {
  currentItem: any;
  filteredData: any[];
  left: string;
  right: string;
  center: string;
  direction: number;
}

const SliderContent: React.FC<SliderContentProps> = ({
  currentItem,
  filteredData,
  left,
  right,
  center,
  direction,
}) => {
  const result_id = filteredData?.map((data) => data.id);
  const { data: tvRating } = useQuery({
    queryKey: ["home_tvRating", result_id],
    queryFn: () => fetchRatings(result_id),
    staleTime: 3600000,
    gcTime: 3600000,
  });
  const [isContentVisible, setIsContentVisible] = useState(false);

  const imageUrl = useMemo(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1920;
    const optimalSize = width <= 768 ? "w780" : "original";
    const path = currentItem.backdrop_path || currentItem.poster_path;

    return `https://image.tmdb.org/t/p/${optimalSize}/${path}`;
  }, [currentItem.backdrop_path, currentItem.poster_path]);

  const itemLink = useMemo(
    () =>
      `/tv/${currentItem?.id}-${spaceToHyphen(
        currentItem?.name || currentItem?.title
      )}`,
    [currentItem?.id, currentItem?.name, currentItem?.title]
  );

  useEffect(() => {
    setIsContentVisible(true);
  }, []);

  const getRating = useMemo(() => {
    const existingRating = tvRating?.find(
      (data: any) => data.tvId === currentItem?.id.toString()
    )?.rating;
    return currentItem &&
      currentItem.vote_average &&
      existingRating &&
      existingRating
      ? (
          (currentItem.vote_average * (currentItem.vote_count || 0) +
            (existingRating || 0) * 10) /
          ((currentItem.vote_count || 0) + 10)
        ).toFixed(1)
      : existingRating && existingRating
      ? existingRating.toFixed(1)
      : currentItem && currentItem.vote_average
      ? currentItem.vote_average.toFixed(1)
      : "0.0";
  }, [tvRating, currentItem]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  return (
    <>
      <div className="w-full h-full absolute top-0 left-0">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 35, duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full bg-center bg-cover bg-no-repeat absolute top-0 left-0"
            style={{ background: left, borderColor: right }}
          >
            <div className="w-full h-[98.49%] relative bg-gray-900">
              <Images
                src={imageUrl}
                alt={`Poster for ${currentItem.name || currentItem.title}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                quality={75}
                loading="eager"
              />
            </div>
            <DynamicGradientOverlays
              left={left}
              right={right}
              center={center}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {isContentVisible && (
        <DynamicOptimizedContentWrapper
          currentItem={currentItem}
          itemLink={itemLink}
          getRating={getRating}
          contentVariants={contentVariants}
        />
      )}
    </>
  );
};

export default React.memo(SliderContent);
