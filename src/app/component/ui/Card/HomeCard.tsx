import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import HomeCardSkeleton from "../Loading/HomeLoading";
import LazyImage from "@/components/ui/lazyimage";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { HomeDramaT } from "../Main/Section";
import HomeCardHover from "./HomeCardHover";

const HomeCard = ({
  heading,
  getDrama,
  existingRatings,
  categoryData,
  categoryDataDetails,
  isDataLoading,
  isDataDetailsLoading,
  path,
}: HomeDramaT) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 1280px)": { slidesToScroll: 4 },
    },
  });

  const getColorFromImage = useColorFromImage();
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [dominantColor, setDominantColor] = useState<{
    [key: string]: string;
  }>({});
  const [linearColors, setLinearColors] = useState<{
    [key: string]: string;
  }>({});

  const getRating = (result: any) => {
    const existingRating = existingRatings?.find(
      (item: any) => item.id === result.id
    )?.rating;
    if (existingRating) {
      return existingRating.toFixed(1);
    }
    return result.vote_average ? result.vote_average.toFixed(1) : "NR";
  };

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const handleCardHover = (
    result: any,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY;

    // Calculate position to ensure the hover card stays within viewport
    const x = Math.min(Math.max(rect.left - 37, 0), window.innerWidth - 286);
    const y = rect.top + scrollY - 835;

    setHoverPosition({ x, y });
    setHoveredCard(result.id);
  };

  const handleExtractColor = useCallback(
    async (imageUrl: string, id: string) => {
      if (!imageUrl) return;
      try {
        const [r, g, b] = await getColorFromImage(imageUrl);
        setDominantColor((prev) => ({
          ...prev,
          [id]: `rgb(${r}, ${g}, ${b})`,
        }));
        const linearGradientAlt = `linear-gradient(rgba(${r},${g},${b},0) 1%, rgb(${r},${g},${b}) 100%)`;
        setLinearColors((prev) => ({ ...prev, [id]: linearGradientAlt }));
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    },
    [getColorFromImage]
  );

  useEffect(() => {
    if (!categoryData?.results) return;
    categoryData.results.forEach((result: any) => {
      if (result?.backdrop_path || result?.poster_path) {
        const imageUrl = `https://image.tmdb.org/t/p/w300/${
          result.poster_path || result.backdrop_path
        }`;
        handleExtractColor(imageUrl, result.id.toString());
      }
    });
  }, [categoryData?.results, handleExtractColor]);

  const isLoading = isDataLoading || isDataDetailsLoading;

  return (
    <div className="max-w-[1808px] mx-auto relative px-4">
      {isLoading ? (
        <HomeCardSkeleton />
      ) : (
        <>
          <h1 className="text-xl md:text-2xl leading-8 font-bold px-2 lg:px-0">
            {heading}
          </h1>
          <div
            className="relative px-2 py-4 md:px-0 overflow-hidden"
            ref={emblaRef}
          >
            <div className="w-full h-full whitespace-nowrap">
              {categoryData?.results
                ?.filter(
                  (item: any) =>
                    item?.poster_path || item?.backdrop_path !== null
                )
                ?.filter(
                  (gen: any) => gen.genre_ids && gen.genre_ids.length !== 0
                )
                .map((result: any, index: number, array: any[]) => {
                  const coverFromDB = getDrama?.find((d: any) =>
                    d?.tv_id?.includes(result?.id)
                  );
                  const cardColor = dominantColor[result.id] || "transparent";
                  const backgroundColor =
                    linearColors[result.id] || "transparent";
                  const isLastItem = index === array.length - 1;

                  return (
                    <div
                      className={`inline-block w-[150px] sm:w-[180px] md:w-[200px] lg:w-[212px] relative group ${
                        isLastItem ? "mr-0" : "mr-3 sm:mr-3 md:mr-4"
                      } ${
                        window.innerWidth >= 1888 ? "" : "card-hover-effect"
                      }`}
                      key={result.id}
                      onMouseEnter={(e) => handleCardHover(result, e)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Link
                        aria-label={`Visit ${result?.name || result?.title}?`}
                        prefetch={true}
                        href={`/${path}/${result?.id}-${spaceToHyphen(
                          result?.name || result?.title
                        )}`}
                        className="block"
                      >
                        <div className="relative rounded-t-sm overflow-hidden z-[2] image-box aspect-[2/2.7]">
                          <LazyImage
                            coverFromDB={coverFromDB?.cover}
                            src={result?.poster_path || result?.backdrop_path}
                            w={result?.poster_path ? "w342" : "w780"}
                            alt={`Poster for ${result?.name || result?.title}`}
                            width={500}
                            height={750}
                            quality={75}
                            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 212px"
                            priority
                            loading="lazy"
                            className="absolute inset-0 box-border p-0 border-0 m-auto block w-full h-full object-cover object-center backface-visibility-hidden"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${btoa(
                              `<svg width="212" height="297" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${cardColor}"/></svg>`
                            )}`}
                            style={{
                              backgroundColor: cardColor,
                              width: "100%",
                              height: "auto",
                            }}
                          />
                          <div
                            className="absolute left-0 right-0 bottom-0 h-[60px] z-[300]"
                            style={{
                              backgroundImage: backgroundColor,
                            }}
                          />
                        </div>
                        <div
                          className="h-[76px] relative p-[0.1rem_0_0] text-[14px] transition-colors duration-300"
                          style={{
                            background: cardColor,
                            borderRadius: "0px 0px 6px 6px",
                          }}
                        >
                          <h2 className="mx-[10px] mb-[6px] whitespace-normal overflow-hidden text-ellipsis flex flex-col text-white/80 font-medium text-[12px] sm:text-[14px] md:text-[16px] leading-tight line-clamp-2">
                            {result?.name || result?.title}
                          </h2>
                          <p className="text-[12px] sm:text-[14px] text-white/70 tracking-[0px] font-normal absolute bottom-[10px] overflow-hidden text-ellipsis whitespace-normal flex items-center mx-[10px] line-clamp-1">
                            {result?.first_air_date ? (
                              result.first_air_date.split("-")[0]
                            ) : (
                              <span className="text-[#2490da]">Upcoming</span>
                            )}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 min-[1888px]:-left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm !border-0 min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="size-6 min-[1888px]:size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 min-[1888px]:-right-4 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm border-0 min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next Slide"
          >
            <ChevronRight className="size-6 min-[1888px]:size-4" />
          </Button>

          {/* Hover Card Portal */}
          <div className="hidden md:block">
            {hoveredCard && (
              <HomeCardHover
                categoryData={categoryData}
                categoryDataDetails={categoryDataDetails}
                path={path}
                dominantColor={dominantColor}
                getRating={getRating}
                hoveredCard={hoveredCard}
                hoverPosition={hoverPosition}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeCard;
