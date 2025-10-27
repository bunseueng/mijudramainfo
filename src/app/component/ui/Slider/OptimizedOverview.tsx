import React from "react";
import { motion } from "framer-motion";

interface OptimizedOverviewProps {
  overview: string;
}

const OptimizedOverview: React.FC<OptimizedOverviewProps> = ({ overview }) => (
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
    className="mb-6 sm:mb-10 flex flex-col content-between w-full max-w-3xl mt-2 sm:mt-3 md:mt-4"
  >
    <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2 md:line-clamp-3">
      {overview?.length > 400 ? overview.slice(0, 400) + "..." : overview}
    </p>
  </motion.section>
);

export default React.memo(OptimizedOverview);
