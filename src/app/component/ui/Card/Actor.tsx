"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActor } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActorCard from "../Card/ActorCard";

type ActorT = {
  heading: string;
  personDB: PersonDBType[] | any;
  categoryData: any;
  isLoading: any;
};

const Actor = ({ heading, personDB, categoryData, isLoading }: ActorT) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

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
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && categoryData) {
      emblaApi.reInit();
      onSelect();
    }
  }, [categoryData, emblaApi, onSelect]);
  return (
    <Card className="max-w-[1808px] mx-auto !bg-transparent border-0">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold my-2">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="relative p-0 px-4">
        <div className="overflow-hidden fade-in" ref={emblaRef}>
          <div className="flex">
            {isLoading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-[180px] h-[280px] rounded-xl mr-4 flex-shrink-0"
                    />
                  ))
              : categoryData?.results
                  ?.filter(
                    (item: any) =>
                      item.profile_path !== "url(/placeholder-image.avif)"
                  )
                  ?.map((result: any, idx: number) => (
                    <ActorCard
                      key={idx}
                      result={result}
                      coverFromDB={personDB?.find((p: any) =>
                        p?.person_id?.includes(result?.id)
                      )}
                      className="mr-4 flex-shrink-0"
                    />
                  ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-9 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10 transition-all duration-300 hover:bg-primary hover:text-primary-foreground pulse-animation border border-black"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Previous actor"
        >
          <ChevronLeft className="text-black dark:text-white h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-9 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10 transition-all duration-300 hover:bg-primary hover:text-primary-foreground pulse-animation border border-black"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Next actor"
        >
          <ChevronRight className="text-black dark:text-white h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Actor;
