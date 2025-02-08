"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export interface WatchNowProps {
  link: string;
}

export default function WatchNowButton2({ link }: WatchNowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex items-center justify-start">
      <motion.div
        className="w-full relative overflow-hidden rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, #3b82f6, #ec4899, #8b5cf6, #10b981)",
            backgroundSize: "300% 300%",
          }}
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : "0% 50%",
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <Link href={link} className="block">
          <motion.button
            className="relative px-6 py-3 w-full font-semibold text-lg text-center transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onTapStart={() => setIsPressed(true)}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
          >
            <motion.span
              className="relative z-10 flex items-center justify-center gap-2"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Play className="w-5 h-5" />
              Watch Now
            </motion.span>
            {isPressed && (
              <motion.div
                className="absolute inset-0 bg-gray-200 dark:bg-gray-600"
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
