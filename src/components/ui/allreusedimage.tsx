"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

const ReusedImage = ({
  src,
  alt,
  width,
  height,
  className,
  loading,
  blurDataURL,
  quality,
  onLoad,
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

  const imageSrc = isVisible ? `${src}` : "/placeholder-image.avif";

  return (
    <Image
      ref={imgRef}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      className={className}
      decoding="async"
      src={imageSrc}
      loading={loading}
      blurDataURL={blurDataURL}
      onLoad={onLoad}
    />
  );
};

export default ReusedImage;
