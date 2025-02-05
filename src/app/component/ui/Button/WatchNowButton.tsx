"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

interface WatchNowProps {
  link: string;
}

export default function WatchNowButton({ link }: WatchNowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary font-medium py-3 px-6 rounded-lg shadow-lg group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={link} className="block">
        <motion.div
          className="absolute inset-0 bg-primary-foreground dark:bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
        <motion.div
          className="relative flex items-center justify-center space-x-2"
          animate={{
            color: isHovered ? "#000" : "var(--primary-foreground)",
          }}
        >
          <motion.div
            animate={{
              rotate: isHovered ? 90 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Play size={20} />
          </motion.div>
          <motion.span
            initial={{ y: 0 }}
            animate={{ y: isHovered ? -30 : 0 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            Watch Now
          </motion.span>
          <motion.span
            className="absolute -bottom-8 pl-4"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? -32 : 0 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            Press Play
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
