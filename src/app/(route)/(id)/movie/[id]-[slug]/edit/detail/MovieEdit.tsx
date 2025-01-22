"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Image from "next/image";
import { movieId } from "@/helper/type";

const MovieEdit: React.FC<movieId> = ({ movie_id }) => {
  const { data: movie } = useQuery({
    queryKey: ["movieEdit", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.error || "Failed to get color");
    }

    return data.averageColor;
  };
  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const color = await getColorFromImage(
        `https://image.tmdb.org/t/p/${movie?.poster_path ? "w92" : "w300"}/${
          movie?.poster_path || movie?.backdrop_path
        }`
      );
      if (color) {
        // Use the color string directly
        setDominantColor(color);
      } else {
        console.error("No valid color returned");
      }
    }
  }, [movie?.poster_path, movie?.backdrop_path]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [extractColor]);

  return (
    <div
      className="bg-cyan-600"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center lg:items-start">
          <Image
            ref={imgRef} // Set the reference to the image
            src={`https://image.tmdb.org/t/p/${
              movie?.poster_path ? "w154" : "w300"
            }/${movie?.poster_path || movie?.backdrops_path}`}
            alt={`${movie?.name}'s Poster`}
            width={80}
            height={90}
            quality={100}
            priority
            className="w-[80px] h-[90px] bg-center bg-cover object-cover rounded-md"
          />
          <div className="flex flex-col pl-5 py-3">
            <h1 className="text-white text-xl font-bold">
              {movie?.title || movie?.name}
            </h1>
            <h3 className="text-white text-lg font-bold">
              ({getYearFromDate(movie?.first_air_date || movie?.release_date)})
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEdit;
