import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITmdbDrama } from "@/helper/type";

const SliderControls = ({
  filteredData,
  currentIndex,
  setCurrentIndex,
  setDirection,
  hoveredIndex,
  setHoveredIndex,
  setIsHovered,
  prevSlide,
  nextSlide,
}: any) => {
  const handleMouseOver = useCallback(
    (index: number) => {
      setHoveredIndex(index);
      setIsHovered(true);
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, setCurrentIndex, setDirection, setHoveredIndex, setIsHovered]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setHoveredIndex(null);
  }, [setIsHovered, setHoveredIndex]);

  return (
    <>
      <div className="absolute bottom-5 xl:bottom-[219px] right-2 md:right-10 flex justify-end space-x-[1px] md:space-x-2 mt-8 z-[111]">
        {filteredData.map((tv: ITmdbDrama, index: number) => (
          <motion.button
            key={tv.id}
            initial={{ opacity: 0.7, scale: 0.8 }}
            animate={{
              opacity:
                hoveredIndex === index || currentIndex === index ? 1 : 0.7,
              scale: hoveredIndex === index || currentIndex === index ? 1 : 0.8,
            }}
            transition={{ duration: 0.4 }}
            className={cn(
              "w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center",
              hoveredIndex === index || currentIndex === index
                ? "bg-white/20"
                : "bg-transparent"
            )}
            onMouseEnter={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={cn(
                "w-3 h-3 rounded-full",
                hoveredIndex === index || currentIndex === index
                  ? "bg-white"
                  : "bg-white/50"
              )}
            />
          </motion.button>
        ))}
      </div>
      <div className="absolute inset-x-0 top-[36%] mx-2 hidden md:flex items-center justify-between z-[103]">
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
    </>
  );
};

export default React.memo(SliderControls);
