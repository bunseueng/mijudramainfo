import type React from "react";
import { motion } from "framer-motion";
import OptimizedContentDetails from "./OptimizedContentDetails";

interface OptimizedContentWrapperProps {
  currentItem: any;
  itemLink: string;
  getRating: string; // Changed from () => string to string
  contentVariants: any;
}

const OptimizedContentWrapper: React.FC<OptimizedContentWrapperProps> = ({
  currentItem,
  itemLink,
  getRating,
  contentVariants,
}) => (
  <motion.div
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    key={currentItem.id}
    className="w-auto absolute inset-x-0 bottom-0 sm:bottom-16 md:bottom-24 lg:bottom-32 xl:bottom-40 2xl:bottom-48 px-4 md:px-4 min-w-[1888px]:px-4 z-[200]"
  >
    <div className="md:max-w-7xl lg:max-w-[1808px] mx-auto relative text-left text-white font-bold">
      <div className="absolute bottom-0 left-0 w-full pb-4 sm:pb-6 md:pb-8 lg:pb-10">
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
          className="inline text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-4 text-balance max-w-3xl"
        >
          {currentItem.name || currentItem.title}
        </motion.h2>
        <motion.div variants={contentVariants} className="block md:mt-4">
          <OptimizedContentDetails
            rating={getRating}
            releaseYear={currentItem?.first_air_date?.split("-")[0]}
            overview={currentItem?.overview}
            itemLink={itemLink}
            currentItem={currentItem}
          />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default OptimizedContentWrapper;
