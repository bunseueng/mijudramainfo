"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSkeletonLoading = () => {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-stone-200">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Skeleton className="w-full h-full" />

          <motion.div className="absolute top-0 h-full w-[30%] lg:w-[540px] -left-1 -rotate-180">
            <Skeleton className="w-full h-full" />
          </motion.div>
          <motion.div className="absolute top-0 h-full w-[30%] lg:w-[540px] -right-1">
            <Skeleton className="w-full h-full" />
          </motion.div>

          <motion.div className="absolute top-0 w-full h-[15vh] lg:h-[174px]">
            <Skeleton className="h-[20%] lg:h-[64px]" />
            <Skeleton className="h-[80%] lg:h-[110px]" />
          </motion.div>
          <div className="absolute bottom-0 w-full h-[20vh] lg:h-[230px]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[45%] md:top-1/2 flex items-center justify-between px-4 md:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-500"
          aria-label="Previous slide"
          disabled
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-500"
          aria-label="Next slide"
          disabled
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute bottom-16 left-0 right-0 w-full max-w-7xl px-4 md:px-16 mx-auto z-[51]">
        <div className="text-left max-w-3xl">
          <Skeleton className="h-12 md:h-16 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/6 mb-6" />
          <div className="flex flex-wrap gap-4 z-50">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        </div>

        <div className="flex justify-start space-x-2 mt-8">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="w-3 h-3 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSkeletonLoading;
