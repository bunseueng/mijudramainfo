"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import Director from "@/app/component/ui/CastRole/Director";
import MainRole from "@/app/component/ui/CastRole/MainRole";
import MovieArt from "@/app/component/ui/CastRole/MovieArt";
import MovieCamera from "@/app/component/ui/CastRole/MovieCamera";
import Product from "@/app/component/ui/CastRole/Product";
import Screenwriter from "@/app/component/ui/CastRole/Screenwriter";
import Sound from "@/app/component/ui/CastRole/Sound";
import LazyImage from "@/components/ui/lazyimage";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import MovieInfo from "../MovieInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import React from "react";
import MovieSupportRole from "@/app/component/ui/CastRole/MovieSupportRole";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { useMovieData } from "@/hooks/useMovieData";

const AllMovieCast = ({ movie_id, getMovie }: any) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const getColorFromImage = useColorFromImage();
  const { movie, isLoading, language } = useMovieData(movie_id);
  const cast = movie?.cast || [];
  const crew = cast?.crew?.map((item: any) => item);

  // Filter the crew array to find all directors
  const directors = crew?.filter(
    (item: any) => item?.known_for_department === "Directing"
  );
  const directorsDB = getMovie?.crew?.filter(
    (item: any) => item?.known_for_department === "Directing"
  );
  const production = crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const productionDB = getMovie?.crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const sound = crew?.filter((item: any) => item?.department === "Sound");
  const soundDB = getMovie?.crew?.filter(
    (item: any) => item?.department === "Sound"
  );
  const writer = crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const writerDB = getMovie?.crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const camera = crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const cameraDB = getMovie?.crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const art = crew?.filter((item: any) => item?.known_for_department === "Art");
  const artDB = getMovie?.crew?.filter(
    (item: any) => item?.known_for_department === "Art"
  );
  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

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

  if (!movie || !cast || isLoading) {
    return (
      <div>
        <SearchLoading />
      </div>
    ); // Add loading state if data is being fetched
  }

  console.log(cast);
  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 py-2">
          <div className="flex items-center lg:items-start px-4 md:px-6 cursor-default">
            {movie?.poster_path || movie?.backdrop_path !== null ? (
              <Image
                ref={imgRef}
                onLoad={extractColor}
                src={`https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`}
                alt={`${movie?.name || movie?.title}'s Poster`}
                width={60}
                height={90}
                quality={100}
                priority
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            ) : (
              <Image
                src="/empty-img.jpg"
                alt="Drama image"
                width={60}
                height={90}
                quality={100}
                loading="lazy"
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            )}
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {movie?.name} (
                {getYearFromDate(movie?.first_air_date || movie?.release_date)})
              </h1>
              <Link
                prefetch={false}
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
      <div className="max-w-6xl mx-auto mt-0 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start px-2">
          <div className="w-full h-full md:w-[66.66667%] px-3">
            <div className=" bg-white dark:bg-[#242424] border rounded-md ">
              <div className="w-full bg-sky-300 dark:bg-[#242424] border-b boder-b-bg-slate-200 dark:border-b-[#272727] rounded-md p-5">
                <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                  {movie?.name}
                </h1>
              </div>
              <div className="flex flex-col xl:flex-row mb-5">
                <div className="w-full">
                  {(directors?.length !== 0 || directorsDB?.length > 0) && (
                    <>
                      <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                        Director
                      </h1>
                      <Director
                        directors={directors}
                        directorsDB={directorsDB}
                      />
                    </>
                  )}
                  {(production?.length !== 0 || productionDB?.length > 0) && (
                    <>
                      <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                        Production
                      </h1>
                      <Product
                        production={production}
                        productionDB={productionDB}
                      />
                    </>
                  )}
                  {writer?.length !== 0 ||
                    (writerDB?.length > 0 && (
                      <>
                        <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                          Writer
                        </h1>
                        <Screenwriter writer={writer} writerDB={writerDB} />
                      </>
                    ))}
                  {(sound?.length !== 0 || soundDB?.length > 0) && (
                    <>
                      <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                        Sound
                      </h1>
                      <Sound sound={sound} soundDB={soundDB} />
                    </>
                  )}
                  {(art?.length !== 0 || artDB?.length > 0) && (
                    <>
                      <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                        Art
                      </h1>
                      <MovieArt art={art} artDB={artDB} />
                    </>
                  )}
                  {(camera?.length !== 0 || cameraDB?.length > 0) && (
                    <>
                      <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                        Camera
                      </h1>
                      <MovieCamera camera={camera} cameraDB={cameraDB} />
                    </>
                  )}
                  <div className="w-full">
                    <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                      Main Role
                    </h1>
                    <MainRole getDrama={getMovie} cast={cast} />

                    <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                      Support Role
                    </h1>
                    <MovieSupportRole getDrama={getMovie} cast={cast} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full md:w-[33.33333%] my-5 md:my-0">
            <div className="hidden md:flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:p-4 border rounded-md bg-white p-2 dark:bg-[#242424]">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "h632" : "w780"
                }/${movie?.poster_path || movie?.backdrop_path}`}
                alt={`${movie?.name}'s Poster`}
                width={350}
                height={480}
                quality={100}
                className="block align-middle w-[350px] h-[480px]"
              />
              <div className="mt-2 flex items-center justify-between hide">
                <ShareButton
                  movie={`https://image.tmdb.org/t/p/original/${
                    movie?.poster_path || movie?.backdrop_path
                  }`}
                />
              </div>
            </div>
            <div className="mt-5 px-3 md:px-0">
              <MovieInfo
                getMovie={getMovie}
                language={language}
                movie={movie}
                allmovieShows={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMovieCast;
