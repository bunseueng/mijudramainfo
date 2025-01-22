"use client";

import React, { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
const SearchLoading = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen bg-gray-100" />; // Placeholder while client-side rendering
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-1">
      <HashLoader color="#00FFFF" />
    </div>
  );
};

export default SearchLoading;
