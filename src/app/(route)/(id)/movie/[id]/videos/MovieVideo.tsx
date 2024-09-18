"use client";

import ColorThief from "colorthief";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { VscQuestion } from "react-icons/vsc";
import { movieVideoList } from "@/helper/item-list";
import { usePathname, useRouter } from "next/navigation";
import { DramaDB } from "@/helper/type";
import { getYearFromDate } from "../MovieMain";
import dynamic from "next/dynamic";
const MovieTrailers = dynamic(() => import("./trailers/MovieTrailers"), {
  ssr: false,
});
const MovieTeasers = dynamic(() => import("./teasers/MovieTeasers"), {
  ssr: false,
});
const MovieClips = dynamic(() => import("./clips/Clips"), { ssr: false });
const MovieBehindTheScenes = dynamic(
  () => import("./behind_the_scenes/BehindTheScenes"),
  { ssr: false }
);
const MovieBloopers = dynamic(() => import("./bloopers/Bloopers"), {
  ssr: false,
});
const MovieFeaturettes = dynamic(() => import("./featurettes/Featurettes"), {
  ssr: false,
});
const LazyImage = dynamic(() => import("@/components/ui/lazyimage"), {
  ssr: false,
});

interface TvTrailerType {
  movie_id: string;
  movieDB: DramaDB | null;
}

const MovieVideo: React.FC<TvTrailerType> = ({ movie_id, movieDB }) => {
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [currentPage, setCurrentPage] = useState("/trailers");
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/movie/${movie?.id}/videos${link}`);
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(imgRef.current);
      setDominantColor(`rgb(${color.join(",")})`); // Set the dominant color in RGB format
    }
  };

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      const extractColor = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(imgElement);
        if (color) {
          setDominantColor(`rgb(${color.join(",")})`);
        }
      };

      imgElement.addEventListener("load", extractColor);

      // Cleanup function to remove the event listener
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [movie]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full h-full">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-2 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            {movie?.poster_path || movie?.backdrop_path !== null ? (
              <LazyImage
                ref={imgRef} // Set the reference to the image
                src={`https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`}
                alt={`${movie?.name || movie?.title}'s Poster`}
                width={60}
                height={90}
                quality={100}
                priority
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
                onLoad={extractColor} // Call extractColor on image load
              />
            ) : (
              <Image
                src="/placeholder-image.avif"
                alt={`${movie?.name || movie?.title}'s Poster`}
                width={200}
                height={200}
                quality={100}
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            )}
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {movie?.title} (
                {getYearFromDate(movie?.first_air_date || movie?.release_date)})
              </h1>
              <Link
                prefetch={true}
                href={`/movie/${movie_id}`}
                className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="relative float-left w-full md:w-[25%] py-3 px-4">
          <div
            className="bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#242527] rounded-sm px-4 py-2"
            style={{ backgroundColor: dominantColor as string | undefined }}
          >
            <div className="flex items-center justify-between text-white">
              <h1>Videos</h1>
              <VscQuestion />
            </div>
          </div>
          <ul className="pt-3">
            {movieVideoList?.map((item, idx) => (
              <li
                key={idx}
                className={`pb-2 ${
                  currentPage === item?.link
                    ? "text-[#1675b6]"
                    : "text-black dark:text-white"
                }`}
              >
                <Link
                  prefetch={true}
                  href={`/movie/${movie?.id}/videos${item?.link}`}
                  className="text-md"
                  shallow
                  onClick={(e) => handleNavigation(e, item.link)}
                >
                  <span className="inline-block text-center mr-5 md:mr-3 lg:mr-5">
                    {item?.icon}
                  </span>
                  <span className="text-center md:text-sm lg:text-md">
                    {item?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {currentPage === "/trailers" ? (
          <MovieTrailers movie_id={movie_id} movie={movie} />
        ) : currentPage === "/teasers" ? (
          <MovieTeasers movie_id={movie_id} movie={movie} />
        ) : currentPage === "/clips" ? (
          <MovieClips movie_id={movie_id} movie={movie} />
        ) : currentPage === "/behind_the_scenes" ? (
          <MovieBehindTheScenes movie_id={movie_id} movie={movie} />
        ) : currentPage === "/bloopers" ? (
          <MovieBloopers movie_id={movie_id} movie={movie} />
        ) : currentPage === "/featurettes" ? (
          <MovieFeaturettes movie_id={movie_id} movie={movie} />
        ) : (
          <MovieTrailers movie_id={movie_id} movie={movie} />
        )}
      </div>
    </div>
  );
};

export default MovieVideo;
