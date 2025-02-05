"use client";

import { fetchAllPopularTvShows } from "@/app/actions/fetchMovieApi";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
import Director from "@/app/component/ui/CastRole/Director";
import Product from "@/app/component/ui/CastRole/Product";
import Screenwriter from "@/app/component/ui/CastRole/Screenwriter";
import Sound from "@/app/component/ui/CastRole/Sound";
import MovieArt from "@/app/component/ui/CastRole/MovieArt";
import MovieCamera from "@/app/component/ui/CastRole/MovieCamera";
import MainRole from "@/app/component/ui/CastRole/MainRole";
import SupportRole from "@/app/component/ui/CastRole/SupportRole";
import GuestRole from "@/app/component/ui/CastRole/GuestRole";
import TvInfo from "../TvInfo";
import React from "react";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { useDramaData } from "@/hooks/useDramaData";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const AllTvCast = ({ tv_id, getDrama }: any) => {
  const { tv, isLoading } = useDramaData(tv_id);
  const cast = tv?.aggregate_credits || [];
  const content = tv?.content_ratings || [];
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const getColorFromImage = useColorFromImage();
  const { data: allTvShows } = useQuery({
    queryKey: ["tvCast", tv_id],
    queryFn: fetchAllPopularTvShows,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const crew = cast?.crew?.map((item: any) => item);

  // Filter the crew array to find all directors
  const directors = crew?.filter(
    (item: any) => item?.known_for_department === "Directing"
  );
  const directorsDB = getDrama?.crew?.filter(
    (item: any) => item?.known_for_department === "Directing"
  );
  const production = crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const productionDB = getDrama?.crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const sound = crew?.filter((item: any) => item?.department === "Sound");
  const soundDB = getDrama?.crew?.filter(
    (item: any) => item?.department === "Sound"
  );
  const writer = crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const writerDB = getDrama?.crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const camera = crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const cameraDB = getDrama?.crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const art = crew?.filter((item: any) => item?.known_for_department === "Art");
  const artDB = getDrama?.crew?.filter(
    (item: any) => item?.known_for_department === "Art"
  );

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl =
        (getDrama?.cover as string) ||
        `https://image.tmdb.org/t/p/${tv?.backdrop_path ? "w300" : "w92"}/${
          tv?.backdrop_path || tv?.poster_path
        }`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const rgbaColor = `rgba(${r}, ${g}, ${b}, 1)`; // Full opacity
      const gradientBackground = `linear-gradient(to right, ${rgbaColor}, rgba(${r}, ${g}, ${b}, 0.84) 50%, rgba(${r}, ${g}, ${b}, 0.84) 100%)`;
      setDominantColor(gradientBackground);
    } else {
      console.error("Image url undefined");
    }
  }, [getDrama?.cover, tv?.backdrop_path, tv?.poster_path, getColorFromImage]);

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

  if (!tv || !cast || isLoading) {
    return <SearchLoading />; // Add loading state if data is being fetched
  }

  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div
        className="bg-cyan-600 dark:bg-[#242424] w-full"
        style={{ backgroundImage: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 py-2">
          <div className="flex items-center lg:items-start px-4 md:px-6 cursor-default">
            {tv?.poster_path || tv?.backdrop_path !== null ? (
              <Image
                ref={imgRef}
                onLoad={extractColor}
                src={`https://image.tmdb.org/t/p/${
                  tv?.poster_path ? "w154" : "w300"
                }/${tv?.poster_path || tv?.backdrop_path}`}
                alt={`${tv?.name || tv?.title}'s Poster` || "Drama Poster"}
                width={60}
                height={90}
                quality={100}
                priority
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            ) : (
              <Image
                src="/default-pf.webp"
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
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                prefetch={false}
                href={`/tv/${tv_id}`}
                className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1115px] mx-auto w-full h-[200px] bg-gray-200 dark:bg-black my-10">
        <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
      </div>
      <div className="max-w-6xl mx-auto mt-0 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start px-2">
          <div className="w-full h-full md:w-[66.66667%] px-3">
            <div className=" bg-white dark:bg-[#242424] border rounded-md ">
              <div className="w-full bg-sky-300 dark:bg-[#242424] border-b boder-b-bg-slate-200 dark:border-b-[#272727] rounded-md p-5">
                <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                  {tv?.name}
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
                    <MainRole getDrama={getDrama} cast={cast} />

                    <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                      Support Role
                    </h1>
                    <SupportRole cast={cast} getDrama={getDrama} />
                    {getDrama?.cast?.length > 0
                      ? getDrama?.cast?.filter(
                          (cast: any) =>
                            cast?.cast_role === "Guest Role" ||
                            (cast?.order > 2 && cast?.total_episode_count < 5)
                        )?.length > 0
                      : cast?.cast?.filter(
                          (cast: any) =>
                            cast?.order > 2 && cast?.total_episode_count < 5
                        )?.length > 0 && (
                          <>
                            <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                              Guest Role
                            </h1>
                            <GuestRole cast={cast} getDrama={getDrama} />
                          </>
                        )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full md:w-[33.33333%] my-5 md:my-0">
            <div className="hidden md:flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:p-4 border rounded-md bg-white p-2 dark:bg-[#242424]">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  tv?.poster_path ? "h632" : "w780"
                }/${tv?.poster_path || tv?.backdrop_path}`}
                alt={`${tv?.name}'s Poster`}
                width={350}
                height={480}
                quality={100}
                className="block align-middle w-[350px] h-[480px]"
              />
              <div className="mt-2 flex items-center justify-between hide">
                <ShareButton
                  tv={`https://image.tmdb.org/t/p/original/${
                    tv?.poster_path || tv?.backdrop_path
                  }`}
                />
              </div>
            </div>
            <div className="mt-5 px-3 md:px-0">
              <TvInfo
                getDrama={getDrama}
                tv={tv}
                content={content}
                allTvShows={allTvShows}
              />
            </div>
            <div className="w-full h-screen bg-gray-200 dark:bg-black my-10">
              <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTvCast;
