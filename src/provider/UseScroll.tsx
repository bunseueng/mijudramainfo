"use client";

import { createContext, useContext, useRef, useState, ReactNode } from "react";
import { useScroll, useSpring } from "framer-motion";

interface ScrollContextType {
  scrollYProgress: any; // Adjust type as needed
  smoothScrollProgress: any; // Adjust type as needed
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Adjust ref type to HTMLDivElement
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 300,
  });

  return (
    <ScrollContext.Provider value={{ scrollYProgress, smoothScrollProgress }}>
      {/* Apply ref to a div element */}
      <div ref={ref}>{children}</div>
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};
