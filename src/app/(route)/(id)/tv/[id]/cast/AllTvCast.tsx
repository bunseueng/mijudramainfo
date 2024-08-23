"use client";

import {
  fetchAllCast,
  fetchAllPopularTvShows,
  fetchContentRating,
  fetchLanguages,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import Director from "@/app/component/ui/CastRole/Director";
import GuestRole from "@/app/component/ui/CastRole/GuestRole";
import MainRole from "@/app/component/ui/CastRole/MainRole";
import MovieArt from "@/app/component/ui/CastRole/MovieArt";
import MovieCamera from "@/app/component/ui/CastRole/MovieCamera";
import Product from "@/app/component/ui/CastRole/Product";
import Screenwriter from "@/app/component/ui/CastRole/Screenwriter";
import Sound from "@/app/component/ui/CastRole/Sound";
import SupportRole from "@/app/component/ui/CastRole/SupportRole";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import ColorThief from "colorthief";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const AllTvCast = ({ tv_id, getDrama }: any) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const { data: tv } = useQuery({
    queryKey: ["movie", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: cast } = useQuery({
    queryKey: ["tvCast", tv_id],
    queryFn: () => fetchAllCast(tv_id),
  });
  const { data: language } = useQuery({
    queryKey: ["tvLanguage", tv_id],
    queryFn: fetchLanguages,
  });
  const { data: content } = useQuery({
    queryKey: ["tvContent", tv_id],
    queryFn: () => fetchContentRating(tv_id),
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["tvCast", tv_id],
    queryFn: fetchAllPopularTvShows,
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

  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };
  const original_country = tv?.origin_country[0];

  const matchedLanguage = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );

  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];

  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === tv.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;

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

  if (!tv || !cast) {
    return <SearchLoading />; // Add loading state if data is being fetched
  }

  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-2 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            {tv?.poster_path || tv?.backdrop_path !== null ? (
              <Image
                ref={imgRef} // Set the reference to the image
                src={`https://image.tmdb.org/t/p/original/${
                  tv?.poster_path || tv?.backdrop_path
                }`}
                alt={`${tv?.name || tv?.title}'s Poster`}
                width={200}
                height={200}
                quality={100}
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            ) : (
              <Image
                src="/empty-img.jpg"
                alt="Drama image"
                width={200}
                height={200}
                quality={100}
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            )}
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
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
      <div className="max-w-6xl mx-auto mt-0 px-2 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start px-2">
          <div className="w-full h-full md:w-[66.66667%] border rounded-md bg-white mr-2 dark:bg-[#242424]">
            <div className="p-5 border-b-2 boder-b-bg-slate-200 dark:border-b-[#272727] bg-sky-300 dark:bg-[#242424] rounded-md">
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
                    <Director directors={directors} directorsDB={directorsDB} />
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
                  <h1 className="text-xl text-sky-900 dark:text-white font-bold mx-5 pt-5 border-b-[1px] border-b-[#78828c21]">
                    Guest Role
                  </h1>
                  <GuestRole cast={cast} getDrama={getDrama} />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full md:w-[33.33333%]">
            <div className="flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:p-5 border rounded-md bg-white p-2 dark:bg-[#242424]">
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  tv?.poster_path || tv?.backdrop_path
                }`}
                alt="image"
                width={500}
                height={300}
                className="block align-middle w-[350px] h-[480px] rounded-lg"
              />
              <div className="mt-2 flex items-center justify-between">
                <ShareButton
                  tv={`https://image.tmdb.org/t/p/original/${
                    tv?.poster_path || tv?.backdrop_path
                  }`}
                />
              </div>
            </div>
            <div className="border border-slate-300 dark:border-[#272727] dark:bg-[#242424] h-full rounded-md mt-5">
              <h1 className="text-white text-md font-bold bg-cyan-600 p-4 rounded-t-md">
                Details:
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <h1 className="text-md font-semibold pr-2">
                  Drama:{" "}
                  <span className="text-sm">{tv?.title || tv?.name}</span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Country:{" "}
                  <span className="text-sm">
                    {matchedLanguage?.english_name}
                  </span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Episode:{" "}
                  <span className="text-sm">{tv?.number_of_episodes}</span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Aired:{" "}
                  <span className="text-sm">
                    {tv?.first_air_date === "" ? "TBA" : tv?.first_air_date}{" "}
                    {tv?.first_air_date === "" ? "" : "-"}{" "}
                    {tv?.last_air_date === null ? "" : tv?.last_air_date}
                  </span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Original Network:{" "}
                  <span className="text-sm">
                    {tv?.networks?.map((network: any) => network?.name)}
                  </span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Duration:{" "}
                  <span className="text-sm">
                    {tv?.episode_run_time[0]} min.
                  </span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Content Rating:{" "}
                  <span className="text-sm">
                    {content?.results?.length === 0
                      ? "Not Yet Rated"
                      : content?.results?.map((rating: any) => rating.rating)}
                  </span>
                </h1>
                <h1 className="text-md font-semibold pr-2">
                  Status:{" "}
                  <span className="text-sm">
                    {tv?.status === "Returning Series" ? "Ongoing" : tv?.status}
                  </span>
                </h1>
              </div>
            </div>
            <div className="border border-slate-300 dark:border-[#272727] dark:bg-[#242424] h-full rounded-md mt-5">
              <h1 className="text-white text-md font-bold bg-cyan-600 p-4 rounded-t-md">
                Statistics:
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <div className="flex items-center pb-1">
                  <h1 className="text-md font-semibold pr-2">Score:</h1>
                  <p className="text-sm">
                    {tv?.vote_average.toFixed(2)}{" "}
                    {tv?.vote_average === 0
                      ? ""
                      : `(scored by ${tv?.vote_count} ${
                          tv?.vote_count < 2 ? " user" : " users"
                        })`}
                  </p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-md font-semibold pr-2">Ranked:</h1>
                  <p className="text-sm">#{!rank ? "10000+" : rank}</p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-md font-semibold pr-2">Popularity:</h1>
                  <p className="text-sm">#{tv?.popularity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTvCast;
