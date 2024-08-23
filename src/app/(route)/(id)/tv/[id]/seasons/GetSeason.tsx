"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import ColorThief from "colorthief";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

const GetSeason = () => {
  const pathParts = window.location.pathname.split("/");
  const tv_id = pathParts[2]; // Assuming the tv_id is at index 2 in the path
  const { data: tv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });

  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

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
    <div>
      <div
        className="bg-cyan-600"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center lg:items-start">
            <Image
              ref={imgRef} // Set the reference to the image
              src={`https://image.tmdb.org/t/p/original/${
                tv?.poster_path || tv?.backdrop_path
              }`}
              alt="director image"
              width={50}
              height={50}
              quality={100}
              className="w-[90px] h-[130px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv?.id}`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        {tv?.seasons?.map((season: any, idx: number) => (
          <div
            className="flex flex-col md:flex-row md:items-center lg:items-start mb-2 md:mb-0 py-8 w-full border-b-2 border-b-slate-400"
            key={idx}
          >
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                season?.poster_path || season?.backdrop_path
              }`}
              alt="director image"
              width={250}
              height={250}
              quality={100}
              className="w-[190px] h-full bg-center object-center rounded-md"
            />
            <div className="flex flex-col p-2 md:p-8">
              <Link
                href={`/tv/${tv?.id}/seasons/${season?.season_number}`}
                className="text-black text-3xl font-bold hover:opacity-70 transform duration-300 cursor-pointer"
              >
                {season?.name}
              </Link>
              <div className="flex items-center text-black font-bold py-5">
                <h1 className="bg-black p-1 rounded-full flex flex-row items-center mr-2">
                  <BsStars className="text-white" size={15} />
                  <span className="text-white text-xs px-2">
                    {season?.vote_average.toFixed(1)}
                  </span>
                </h1>
                {getYearFromDate(season?.air_date)}
                <span className="px-2">•</span>
                <span>{season?.episode_count} Episodes</span>
              </div>
              {season?.season_number === 1 ? (
                <p className="text-md font-bold">
                  Season 1 of {tv?.name} premiered on {season?.air_date}
                </p>
              ) : (
                <p className="text-md font-bold">{season?.overview}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSeason;
