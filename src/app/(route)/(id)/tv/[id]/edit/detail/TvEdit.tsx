"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import ColorThief from "colorthief";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import LazyImage from "@/components/ui/lazyimage";
interface tvId {
  tv_id: string;
}

const TvEdit: React.FC<tvId> = ({ tv_id }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(imgRef.current);
      setDominantColor(`rgb(${color.join(",")})`); // Set the dominant color in RGB format
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [tv]);

  return (
    <div
      className="bg-cyan-600"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center lg:items-start">
          <LazyImage
            ref={imgRef} // Set the reference to the image
            src={`https://image.tmdb.org/t/p/${
              tv?.poster_path ? "w154" : "w300"
            }/${tv?.poster_path || tv?.backdrops_path}`}
            alt={`${tv?.name}'s Poster`}
            width={80}
            height={90}
            quality={100}
            priority
            className="w-[80px] h-[90px] bg-center bg-cover object-cover rounded-md"
          />
          <div className="flex flex-col pl-5 py-3">
            <h1 className="text-white text-2xl font-bold">
              {tv?.title || tv?.name}
            </h1>
            <h3 className="text-white text-2xl font-bold">
              ({getYearFromDate(tv?.first_air_date || tv?.release_date)})
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvEdit;
