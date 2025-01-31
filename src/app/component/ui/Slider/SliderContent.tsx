"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Images from "next/image";
import { Info, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { motion, AnimatePresence } from "framer-motion";
import { getGenreName } from "@/lib/getGenres";

const SliderContent = ({
  currentItem,
  existingRatings,
  left,
  right,
  center,
  direction,
}: any) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const itemLink = useMemo(
    () =>
      `/tv/${currentItem?.id}-${spaceToHyphen(
        currentItem?.name || currentItem?.title
      )}`,
    [currentItem?.id, currentItem?.name, currentItem?.title]
  );

  const imageUrl = useMemo(
    () =>
      `https://image.tmdb.org/t/p/${
        currentItem.backdrop_path ? "original" : "w154"
      }/${currentItem.backdrop_path || currentItem.poster_path}`,
    [currentItem.backdrop_path, currentItem.poster_path]
  );

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsContentVisible(true);
  }, [imageUrl]);

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
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {/* Added overflow-hidden to prevent image border from showing */}
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
              x: { type: "spring", stiffness: 100, damping: 18, duration: 1 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full bg-center bg-cover bg-no-repeat absolute top-0 left-0"
            style={{ background: left, borderColor: right }}
          >
            <BackgroundImage
              imageUrl={imageUrl}
              title={currentItem.name || currentItem.title}
            />
            <GradientOverlays left={left} right={right} center={center} />
          </motion.div>
        </AnimatePresence>
      </div>
      {isContentVisible && (
        <OptimizedContentWrapper
          currentItem={currentItem}
          itemLink={itemLink}
          getRating={getRating}
          contentVariants={contentVariants}
        />
      )}
    </>
  );
};

const BackgroundImage = React.memo(
  ({ imageUrl, title }: { imageUrl: string; title: string }) => (
    // Increased width to ensure full coverage during slide
    <div className="w-full h-[98.49%] relative">
      <Images
        src={imageUrl || "/placeholder.svg"}
        alt={`Poster for ${title}` || "Poster"}
        priority={true}
        loading="eager"
        fill
        className="w-[46.67%] h-[98.49%] absolute top-0 bottom-0 bg-no-repeat bg-cover"
        sizes="100vw"
        quality={80}
        placeholder="blur"
        fetchPriority="high"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  )
);
BackgroundImage.displayName = "BackgroundImage";

const GradientOverlays = React.memo(({ left, right, center }: any) => (
  <div className="max-w-[1808px] w-full h-full absolute top-0 right-0 left-0 mx-auto flex justify-between z-[101]">
    <div className="h-full w-[30%]" style={{ background: left }} />
    <div
      className="absolute top-0 w-full h-[120px]"
      style={{ background: center }}
    />
    <div className="h-full w-[15%]" style={{ background: right }} />
  </div>
));
GradientOverlays.displayName = "GradientOverlays";

const OptimizedContentWrapper = React.memo(
  ({ currentItem, itemLink, getRating, contentVariants }: any) => (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={currentItem.id}
      className="w-auto absolute inset-x-0 bottom-2 md:bottom-72 px-4 md:px-4 min-w-[1888px]:px-4 z-50"
    >
      <div className="text-left inline-block text-white font-bold">
        <motion.h2
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut",
              },
            },
            exit: {
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            },
          }}
          className="inline text-2xl xl:text-6xl font-bold md:mb-4 text-balance"
        >
          {currentItem.name || currentItem.title}
        </motion.h2>
        <motion.div variants={contentVariants} className="block mt-4">
          <OptimizedContentDetails
            rating={getRating}
            releaseYear={currentItem?.first_air_date?.split("-")[0]}
            overview={currentItem?.overview}
            itemLink={itemLink}
            currentItem={currentItem}
          />
        </motion.div>
      </div>
    </motion.div>
  )
);
OptimizedContentWrapper.displayName = "OptimizedContentWrapper";

const OptimizedContentDetails = React.memo(
  ({ rating, releaseYear, currentItem, overview, itemLink }: any) => {
    const renderGenres = useCallback(
      () =>
        currentItem.genre_ids.map((genreId: string) => {
          const genreName = getGenreName(genreId);
          return genreName ? (
            <motion.span
              key={genreId}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              className="bg-orange-500 text-xs px-2 py-1 text-gray-200 rounded"
            >
              {genreName}
            </motion.span>
          ) : null;
        }),
      [currentItem.genre_ids]
    );

    return (
      <div className="relative w-full h-auto flex border-box">
        <div className="relative w-full">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="flex items-center gap-2 mb-2 text-md md:text-xl"
          >
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="ml-1 text-white font-semibold">{rating}</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-gray-200">
              {releaseYear || <span className="text-blue-400">Upcoming</span>}
            </span>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="flex flex-wrap gap-1 mb-3"
          >
            {renderGenres()}
          </motion.div>
          <OptimizedOverview overview={overview} />
          <OptimizedActionButtons itemLink={itemLink} />
        </div>
      </div>
    );
  }
);
OptimizedContentDetails.displayName = "OptimizedContentDetails";

const OptimizedOverview = React.memo(({ overview }: { overview: string }) => (
  <motion.section
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    }}
    className="hidden md:flex flex-col content-between w-full h-[118px] mt-2 grow"
  >
    <p className="w-[31.25vw] min-w-[320px] md:w-[525px] md:h-[72px] md:mt-[16px] md:text-[16px] md:line-clamp-3 overflow-hidden h-[42px] leading-[1.5em] mt-[12px] text-[14px] font-medium text-ellipsis line-clamp-2 -webkit-box-orient-vertical">
      {overview?.length > 400 ? overview.slice(0, 400) + "..." : overview}
    </p>
  </motion.section>
));
OptimizedOverview.displayName = "OptimizedOverview";

const OptimizedActionButtons = React.memo(
  ({ itemLink }: { itemLink: string }) => (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      className="hidden md:flex flex-wrap gap-4 z-[110]"
    >
      <ActionButton
        href={`${itemLink}?success=true`}
        className="bg-green-500 hover:bg-green-600"
        icon={<Play className="mr-2 h-5 w-5" />}
        text="Watch Trailer"
      />
      <ActionButton
        href={itemLink}
        className="border-gray-700 hover:bg-gray-200 hover:text-gray-700"
        icon={<Info className="mr-2 h-5 w-5" />}
        text="More Info"
      />
    </motion.div>
  )
);
OptimizedActionButtons.displayName = "OptimizedActionButtons";

const ActionButton = React.memo(({ href, className, icon, text }: any) => (
  <Link
    aria-label={text}
    href={href}
    prefetch={false}
    className="flex items-center"
  >
    <Button
      size="lg"
      className={`rounded-full px-8 text-white transition-all duration-500 ${className}`}
    >
      {icon} {text}
    </Button>
  </Link>
));
ActionButton.displayName = "ActionButton";

export default React.memo(SliderContent);
