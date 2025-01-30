"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Image from "next/image";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { useDramaData } from "@/hooks/useDramaData";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Drama } from "@/helper/type";
interface tvId {
  tv_id: string;
}

const TvEdit: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { tv, isLoading } = useDramaData(tv_id);
  const getColorFromImage = useColorFromImage();
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const handleExtractColor = useCallback(async () => {
    const imageUrl = `https://image.tmdb.org/t/p/w300/${
      tv?.backdrop_path || tv?.poster_path
    }`;
    const [r, g, b] = await getColorFromImage(imageUrl);

    const startColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
    const endColor = `rgba(${r}, ${g}, ${b}, 0.7)`;

    const gradientBackground = `linear-gradient(${startColor}, ${endColor})`;
    setDominantColor(gradientBackground);
  }, [tv?.backdrop_path, tv?.poster_path, getColorFromImage]);

  useEffect(() => {
    handleExtractColor();
  }, [handleExtractColor]);

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <div
      className="bg-cyan-600 rounded-t-md"
      style={{ background: dominantColor as string | undefined }}
    >
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center lg:items-start">
          <Image
            ref={imgRef} // Set the reference to the image
            src={
              tvDetails?.cover ||
              `https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w154" : "w300"
              }/${tv?.poster_path || tv?.backdrops_path}`
            }
            alt={`${tv?.name}'s Poster` || "Drama Poster"}
            width={80}
            height={90}
            quality={100}
            priority
            className="w-[90px] h-[120px] bg-cover rounded-md"
          />
          <div className="flex flex-col pl-5 py-3">
            <h1 className="text-white text-xl font-bold">
              {tv?.title || tv?.name}
            </h1>
            <h3 className="text-white text-lg font-bold">
              ({getYearFromDate(tv?.first_air_date || tv?.release_date)})
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvEdit;
