"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { PiMoonStarsFill } from "react-icons/pi";
import { IoMdSunny } from "react-icons/io";

// Loading SVG placeholder
const LoadingPlaceholder = () => (
  <Image
    src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
    width={36}
    height={36}
    alt="Loading Light/Dark Toggle"
    title="Loading Light/Dark Toggle"
    loading="lazy"
    priority={false} // Not critical for initial render
  />
);

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder while component is mounting
  if (!mounted) return <LoadingPlaceholder />;

  // Render theme toggle icons based on current theme
  if (resolvedTheme === "dark") {
    return (
      <IoMdSunny
        onClick={() => setTheme("light")}
        className="cursor-pointer text-2xl"
      />
    );
  }

  if (resolvedTheme === "light") {
    return (
      <PiMoonStarsFill
        onClick={() => setTheme("dark")}
        className="cursor-pointer text-white text-2xl"
      />
    );
  }

  // Default case (fallback)
  return <LoadingPlaceholder />;
}
