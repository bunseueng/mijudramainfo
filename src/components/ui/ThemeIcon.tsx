"use client";

import { FiSun } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { GiMoonBats } from "react-icons/gi";

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
      <FiSun
        onClick={() => setTheme("light")}
        className="cursor-pointer text-xl"
      />
    );
  }

  if (resolvedTheme === "light") {
    return (
      <GiMoonBats
        onClick={() => setTheme("dark")}
        className="cursor-pointer text-white text-xl"
      />
    );
  }

  // Default case (fallback)
  return <LoadingPlaceholder />;
}
