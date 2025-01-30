"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Image from "next/image";
import { movieId } from "@/helper/type";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { useMovieData } from "@/hooks/useMovieData";

const MovieEdit: React.FC<movieId> = ({ movie_id }) => {
  const { movie } = useMovieData(movie_id);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const getColorFromImage = useColorFromImage();

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl = `https://image.tmdb.org/t/p/${
        movie?.backdrop_path ? "w300" : "w92"
      }/${movie?.backdrop_path || movie?.poster_path}`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const color = `rgb(${r}, ${g}, ${b})`; // Full opacity
      setDominantColor(color);
    }
  }, [movie?.backdrop_path, movie?.poster_path, getColorFromImage]);

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
