"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import dynamic from "next/dynamic";

const DynamicOptimizedContentWrapper = dynamic(
  () => import("./OptimizedContentWrapper"),
  { ssr: false }
);
const DynamicGradientOverlays = dynamic(() => import("./GradientOverlays"), {
  ssr: false,
});

interface SliderContentProps {
  currentItem: any;
  existingRatings: any[];
  left: string;
  right: string;
  center: string;
  direction: number;
}

const SliderContent: React.FC<SliderContentProps> = ({
  currentItem,
  existingRatings,
  left,
  right,
  center,
  direction,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const itemLink = useMemo(
    () =>
      `/tv/${currentItem?.id}-${spaceToHyphen(
        currentItem?.name || currentItem?.title
      )}`,
    [currentItem?.id, currentItem?.name, currentItem?.title]
  );

  const imageUrl = useMemo(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1920;
    const optimalSize = width <= 768 ? "w780" : "original";

    return {
      initial: `https://image.tmdb.org/t/p/w300/${
        currentItem.backdrop_path || currentItem.poster_path
      }`,
      optimal: `https://image.tmdb.org/t/p/${optimalSize}/${
        currentItem.backdrop_path || currentItem.poster_path
      }`,
    };
  }, [currentItem.backdrop_path, currentItem.poster_path]);

  useEffect(() => {
    setIsContentVisible(true);
  }, []);

  const getRating = useMemo(() => {
    const existingRating = existingRatings?.find(
      (item: any) => item.id === currentItem.id
    )?.rating;
    if (existingRating) {
      return existingRating.toFixed(1);
    }
    return currentItem.vote_average
      ? currentItem.vote_average.toFixed(1)
      : "NR";
  }, [currentItem.id, currentItem.vote_average, existingRatings]);

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
      zIndex: 1,
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
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 18, duration: 0.6 },
              opacity: { duration: 0.1 },
            }}
            className="w-full h-full bg-center bg-cover bg-no-repeat absolute top-0 left-0"
            style={{ background: left, borderColor: right }}
          >
            <BackgroundImage
              initialSrc={imageUrl.initial}
              optimalSrc={imageUrl.optimal}
              title={currentItem.name || currentItem.title}
            />
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

interface BackgroundImageProps {
  initialSrc: string;
  optimalSrc: string;
  title: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = React.memo(
  ({ initialSrc, optimalSrc, title }) => {
    return (
      <div className="w-full h-[98.49%] relative bg-gray-900">
        <Image
          src={optimalSrc || "/placeholder-image.avif"}
          alt={`Poster for ${title}`}
          fetchPriority="high"
          priority={true}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1920px"
          quality={75}
          placeholder="blur"
          blurDataURL={initialSrc}
        />
      </div>
    );
  }
);
BackgroundImage.displayName = "BackgroundImage";

export default React.memo(SliderContent);
