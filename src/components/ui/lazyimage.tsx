"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

const LazyImage = ({
  src,
  w,
  alt,
  width,
  height,
  className,
  priority = true,
  blurDataURL,
  onLoad,
  quality,
  sizes,
  ref,
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const imageSrc = isVisible
    ? `https://image.tmdb.org/t/p/${w}${src}`
    : "/placeholder-image.avif";

  return (
    <Image
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      className={`${className} aspect-[${width}/${height}]`}
      decoding="async"
      priority={priority}
      blurDataURL={blurDataURL}
      onLoad={onLoad}
      sizes={sizes}
    />
  );
};

export default LazyImage;
