import type React from "react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeDramaT } from "../Main/Section";
import HomeCardSkeleton from "../Loading/HomeLoading";
import HomeCardHover from "./HomeCardHover";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import HomeCardItem from "./HomeCardItem";
import { useQuery } from "@tanstack/react-query";
import { fetchRatings } from "@/app/actions/fetchMovieApi";

const HomeCard = ({
  heading,
  getDrama,
  categoryData,
  isDataLoading,
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
  const [dominantColor, setDominantColor] = useState<{ [key: string]: string }>(
    {}
  );
  const [linearColors, setLinearColors] = useState<{ [key: string]: string }>(
    {}
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const ids = categoryData?.results?.map((data: { id: string }) => data.id);
  const { data: ratings } = useQuery({
    queryKey: ["home_card_rating", ids],
    queryFn: () => fetchRatings(ids),
    enabled: Array.isArray(ids) && ids.length > 0,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  const getSpecificRating = (itemId: string) => {
    if (!ratings || !Array.isArray(ratings)) return 0;

    // Find rating where tvId matches the itemId
    const matchingRating = ratings.find(
      (rating) => rating.tvId === itemId.toString()
    );

    return matchingRating?.rating || 0;
  };

  const getRating = (result: any) => {
    if (!result?.id) return "0.0";

    // Convert ID to string for consistent comparison
    const itemId = result.id.toString();
    const userRating = getSpecificRating(itemId);
    const tmdbRating = result.vote_average || 0;
    const voteCount = result.vote_count || 0;

    if (userRating > 0 && tmdbRating > 0) {
      // Calculate weighted average giving more weight to user rating
      const userWeight = 10; // Give user rating more weight
      const weightedAverage =
        (tmdbRating * voteCount + userRating * userWeight) /
        (voteCount + userWeight);
      return weightedAverage.toFixed(1);
    }

    // If only user rating exists
    if (userRating > 0) {
      return userRating.toFixed(1);
    }

    // If only TMDB rating exists
    if (tmdbRating > 0) {
      return tmdbRating.toFixed(1);
    }

    return "0.0";
  };

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
        setLinearColors((prev) => ({
          ...prev,
          [id]: `linear-gradient(rgba(${r},${g},${b},0) 1%, rgb(${r},${g},${b}) 100%)`,
        }));
      } catch (error) {
        throw new Error("Failed to extracted image");
      }
    },
    [getColorFromImage]
  );

  useEffect(() => {
    if (!categoryData?.results) return;
    categoryData.results.forEach((result: any) => {
      if (result?.backdrop_path || result?.poster_path) {
        const imageUrl =
          `https://image.tmdb.org/t/p/${result.poster_path ? "w154" : "w300"}/${
            result.poster_path || result.backdrop_path
          }` || "/placeholder-image.avif";
        handleExtractColor(imageUrl, result.id.toString());
      }
    });
  }, [categoryData?.results, handleExtractColor]);

  if (isDataLoading) {
    return <HomeCardSkeleton />;
  }

  return (
    <div className="max-w-[1808px] mx-auto relative px-4">
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
              (item: any) => item?.poster_path || item?.backdrop_path !== null
            )
            ?.filter((gen: any) => gen.genre_ids && gen.genre_ids.length !== 0)
            .map((result: any, index: number, array: any[]) => (
              <HomeCardItem
                key={result.id}
                result={result}
                getDrama={getDrama}
                path={path}
                dominantColor={dominantColor[result.id]}
                linearColor={linearColors[result.id]}
                isLastItem={index === array.length - 1}
                onMouseEnter={(e) => handleCardHover(result, e)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 min-[1888px]:-left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm  border border-black min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous Slide"
      >
        <ChevronLeft className="text-black dark:text-white font-bold size-6 min-[1888px]:size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 min-[1888px]:-right-4 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm border border-black min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next Slide"
      >
        <ChevronRight className="text-black dark:text-white font-bold size-6 min-[1888px]:size-4" />
      </Button>

      <div className="hidden md:block">
        {hoveredCard && (
          <HomeCardHover
            categoryData={categoryData}
            path={path}
            dominantColor={dominantColor}
            getRating={getRating}
            hoveredCard={hoveredCard}
            hoverPosition={hoverPosition}
          />
        )}
      </div>
    </div>
  );
};

export default HomeCard;
