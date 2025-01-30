"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import LazyImage from "@/components/ui/lazyimage";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsStars } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  tv_id: string;
};
const GetSeason = ({ tv_id }: Props) => {
  const { data: tv } = useQuery({
    queryKey: ["tv_season", tv_id], // Include tv_id in the query key
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const getColorFromImage = useColorFromImage();
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl = `https://image.tmdb.org/t/p/${
        tv?.poster_path ? "w92" : "w300"
      }/${tv?.poster_path || tv?.backdrop_path}`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const rgbaColor = `rgb(${r}, ${g}, ${b})`; // Full opacity
      setDominantColor(rgbaColor);
    } else {
      console.error("Image url undefined");
    }
  }, [tv?.backdrop_path, tv?.poster_path, getColorFromImage]);

  // Ensure the image element is referenced correctly
  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [tv, extractColor]);
  return (
    <div className="w-full h-full">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-3 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            <Image
              ref={imgRef} // Set the reference to the image
              src={`https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w92" : "w300"
              }/${tv?.poster_path || tv?.backdrop_path}`}
              alt={`${tv?.name || tv?.title}'s Poster`}
              width={200}
              height={200}
              quality={100}
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
              priority
              onLoad={extractColor}
            />
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv?.id}-${tv?.name}`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
                prefetch={false}
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        {tv?.seasons?.map((season: any, idx: number) => (
          <div
            className="flex flex-col md:flex-row md:items-center lg:items-start mb-2 md:mb-0 py-8 w-full border-b-2 border-b-slate-400"
            key={idx}
          >
            <LazyImage
              src={`https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w500" : "w780"
              }/${tv?.poster_path || tv?.backdrop_path}`}
              alt={`${season?.name || season?.title}'s Poster`}
              width={190}
              height={190}
              quality={100}
              priority
              className="w-[190px] h-full bg-center object-center rounded-md"
            />
            <div className="flex flex-col p-2 md:p-8">
              <Link
                href={`/tv/${tv?.id}/seasons/${season?.season_number}`}
                className="text-black dark:text-white text-3xl font-bold hover:opacity-70 transform duration-300 cursor-pointer"
                prefetch={false}
              >
                {season?.name}
              </Link>
              <div className="flex items-center text-black dark:text-white font-bold py-5">
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
