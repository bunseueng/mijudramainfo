import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeCardSkeleton = () => {
  return (
    <div className="max-w-[1808px] mx-auto relative ">
      <Skeleton className="h-8 w-32 ml-2.5 md:ml-0" />
      <div className="relative px-2 py-4 md:px-0 overflow-hidden">
        <div className="w-full h-full whitespace-nowrap">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="inline-block w-[150px] sm:w-[180px] md:w-[200px] lg:w-[212px] relative mr-3 sm:mr-3 md:mr-4"
              >
                <div className="w-full relative inline-block align-top tracking-normal card-content">
                  <div className="mr-0 mb-0">
                    <div className="relative">
                      <Skeleton className="w-full aspect-[212/318] rounded-t-sm" />
                      <div className="absolute left-0 right-0 bottom-0 h-[60px] z-[300] bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>
                    <div className="h-[76px] relative p-[0.1rem_0_0] rounded-b-sm bg-gray-800">
                      <Skeleton className="h-4 w-3/4 mx-[10px] mb-2 bg-gray-700" />
                      <Skeleton className="h-3 w-1/2 mx-[10px] absolute bottom-[10px] bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 min-[1888px]:-left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm !border-0 min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
        disabled
      >
        <ChevronLeft className="size-6 min-[1888px]:size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 min-[1888px]:-right-8 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-transparent min-[1888px]:bg-background/80 min-[1888px]:text-white backdrop-blur-0 min-[1888px]:backdrop-blur-sm border-0 min-[1888px]:border hover:bg-transparent min-[1888px]:hover:bg-background/60"
        disabled
      >
        <ChevronRight className="size-6 min-[1888px]:size-4" />
      </Button>
    </div>
  );
};

export default HomeCardSkeleton;
