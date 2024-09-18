"use client";

import { useState, useEffect } from "react";

export const UpdateMedia = (width: number) => {
  const [isScreenSize, setIsScreenSize] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      setIsScreenSize(window.innerWidth <= width);
    };

    updateMedia(); // Check on mount
    window.addEventListener("resize", updateMedia); // Listen for window resize

    return () => window.removeEventListener("resize", updateMedia); // Cleanup
  }, [width]);

  return isScreenSize;
};
