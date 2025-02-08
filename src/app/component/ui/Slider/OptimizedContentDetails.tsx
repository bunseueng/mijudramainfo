import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getGenreName } from "@/lib/getGenres";
import OptimizedOverview from "./OptimizedOverview";
import OptimizedActionButtons from "./OptimizedActionButtons";

interface OptimizedContentDetailsProps {
  rating: number;
  releaseYear: string;
  currentItem: any;
  overview: string;
  itemLink: string;
}

const OptimizedContentDetails: React.FC<OptimizedContentDetailsProps> = ({
  rating,
  releaseYear,
  currentItem,
  overview,
  itemLink,
}) => {
  const renderGenres = useCallback(
    () =>
      currentItem.genre_ids.slice(0, 2).map((genreId: string) => {
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
            className="bg-orange-700 text-[8px] sm:text-sm px-2 py-1 text-white rounded font-semibold"
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
          className="flex items-center gap-2 mb-2 text-sm sm:text-md md:text-lg lg:text-xl"
        >
          <div className="flex items-center">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
            <span className="text-xs md:text-sm ml-1 text-white font-semibold">
              {rating}
            </span>
          </div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <span className="text-white text-xs md:text-sm">
            {releaseYear || <span className="text-blue-200">Upcoming</span>}
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
};

export default React.memo(OptimizedContentDetails);
