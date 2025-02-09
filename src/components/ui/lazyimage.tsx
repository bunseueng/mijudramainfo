"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const LazyImage = ({
  src,
  w = "w500", // Default to w500 if not provided
  alt,
  width,
  height,
  className,
  priority = true,
  blurDataURL,
  onLoad,
  quality,
  sizes,
  coverFromDB,
  ref,
  onError,
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Valid TMDB image sizes
  const validSizes = [
    "w92",
    "w154",
    "w185",
    "w342",
    "w500",
    "w780",
    "original",
  ];

  // Ensure we're using a valid size parameter
  const sizeParam = validSizes.includes(w) ? w : "w500";

  useEffect(() => {
    const observerTarget = imgRef.current;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, []);

  // Determine the final image source
  const imageSrc = (() => {
    // If we have a cover from DB, use that
    if (coverFromDB) return coverFromDB;

    // If src is null, undefined, contains "null", or has invalid size, use placeholder
    if (!src || src === "null" || src === null || src.includes("/null")) {
      return "/placeholder-image.avif";
    }

    // If it's already a full URL (including TMDB base), use placeholder if it contains invalid patterns
    if (src.startsWith("https://")) {
      if (src.includes("/null") || src.includes("undefined")) {
        return "/placeholder-image.avif";
      }
      return src;
    }

    // If it's a local path starting with /, return as is
    if (src.startsWith("/")) {
      return src === "/placeholder-image.avif"
        ? src
        : `https://image.tmdb.org/t/p/${sizeParam}${src}`;
    }

    // Otherwise, construct the TMDB URL
    return `https://image.tmdb.org/t/p/${sizeParam}/${src}`;
  })();

  return (
    <Image
      ref={imgRef}
      src={isVisible ? imageSrc : "/placeholder-image.avif"}
      alt={alt || "Image"}
      width={width}
      height={height}
      quality={quality}
      className={`${className} aspect-[${width}/${height}]`}
      decoding="async"
      priority={priority}
      blurDataURL={blurDataURL}
      onLoad={onLoad}
      sizes={sizes}
      onError={onError}
    />
  );
};

export default LazyImage;
