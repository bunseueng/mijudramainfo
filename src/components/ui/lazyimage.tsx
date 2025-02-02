"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

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

  useEffect(() => {
    const observerTarget = imgRef.current; // Store ref value

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

  // Determine the correct size parameter
  const sizeParam = w.startsWith("w") ? w : "w500";

  // Determine the final image source
  const imageSrc = (() => {
    if (coverFromDB) return coverFromDB;
    if (!src) return "/placeholder-image.avif";
    if (src.startsWith("/")) {
      if (src === "/placeholder-image.avif") return src;
      return `https://image.tmdb.org/t/p/${sizeParam}${src}`;
    }
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
