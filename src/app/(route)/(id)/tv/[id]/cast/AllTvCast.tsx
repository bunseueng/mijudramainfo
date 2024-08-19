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
import { FaArrowLeft } from "react-icons/fa";

const AllTvCast = ({ tv_id, getDrama }: any) => {
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
  const production = crew?.filter(
    (item: any) => item?.known_for_department === "Production"
  );
  const sound = crew?.filter(
    (item: any) => item?.known_for_department === "Sound"
  );
  const writer = crew?.filter(
    (item: any) => item?.known_for_department === "Creator"
  );
  const camera = crew?.filter(
    (item: any) => item?.known_for_department === "Camera"
  );
  const art = crew?.filter((item: any) => item?.known_for_department === "Art");

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

  console.log(getDrama);
  if (!tv || !cast) {
    return <div>Loading...</div>; // Add loading state if data is being fetched
  }
  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div className=" bg-cyan-600 dark:bg-[#242424]">
        <div className="w-full container mx-auto flex items-center mt-0 px-2 py-2 lg:py-6">
          <div className="flex items-center lg:items-start px-2">
            {tv?.poster_path || tv?.backdrop_path !== null ? (
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  tv?.poster_path || tv?.backdrop_path
                }`}
                alt={`${tv?.name || tv?.title}'s Poster`}
                width={200}
                height={200}
                quality={100}
                className="w-[90px] h-[130px] bg-center object-center rounded-md"
              />
            ) : (
              <Image
                src="/empty-img.jpg"
                alt="Drama image"
                width={200}
                height={200}
                quality={100}
                className="w-[90px] h-[130px] bg-center object-center rounded-md"
              />
            )}
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-xl font-bold ">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv_id}`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1536px] mx-auto mt-0 px-2 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start px-2">
          <div className="w-full h-full lg:w-[60] xl:w-[75%] border rounded-md bg-white mr-2 dark:bg-[#242424]">
            <div className="p-5 border-b-2 boder-b-bg-slate-200 dark:border-b-[#272727] bg-sky-300 dark:bg-[#242424] rounded-md">
              <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                {tv?.name}
              </h1>
            </div>
            <div className="flex flex-col xl:flex-row mb-5">
              <div className="w-full">
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Director
                </h1>
                {directors?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Director has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <Director directors={directors} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Production
                </h1>
                {production?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Producer has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <Product production={production} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Writer
                </h1>
                {writer?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Writer has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <Screenwriter writer={writer} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Sound
                </h1>
                {sound?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Sound has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <Sound sound={sound} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Art
                </h1>
                {art?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Art Designer has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <MovieArt art={art} />
                )}
                <h1 className="text-xl text-sky-900 dark:text-white font-bold px-5 pt-5">
                  Camera
                </h1>
                {camera?.length === 0 ? (
                  <p className="text-black dark:text-white p-5">
                    Camera has not added to {tv?.name} yet.
                  </p>
                ) : (
                  <MovieCamera camera={camera} />
                )}
                <div className="w-full">
                  <h1 className="text-xl text-sky-900 dark:text-white  font-bold p-5">
                    Main Role
                  </h1>
                  <MainRole getDrama={getDrama} cast={cast} />

                  <h1 className="text-xl text-sky-900 dark:text-white  font-bold p-5">
                    Support Role
                  </h1>
                  {cast?.cast?.filter(
                    (cast: any) =>
                      cast?.order > 2 && cast?.total_episode_count > 5
                  )?.length === 0 ? (
                    <p className="text-black dark:text-white pl-5">
                      Support Role has not added to {tv?.name}
                    </p>
                  ) : (
                    <SupportRole cast={cast} getDrama={getDrama} />
                  )}
                  <h1 className="text-xl text-sky-900 dark:text-white  font-bold p-5">
                    Guest Role
                  </h1>
                  {cast?.cast?.filter(
                    (cast: any) =>
                      cast?.order > 2 && cast?.total_episode_count < 5
                  )?.length === 0 ? (
                    <p className="text-black dark:text-white pl-5">
                      Guest Role has not added to this {tv?.name}
                    </p>
                  ) : (
                    <GuestRole cast={cast} getDrama={getDrama} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full lg:w-[40%] xl:w-[25%]">
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
              <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4 rounded-t-md">
                Details:
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <h1 className="text-lg font-bold pr-2">
                  Drama:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.title || tv?.name}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Country:{" "}
                  <span className="font-semibold">
                    {matchedLanguage?.english_name}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Episode:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.number_of_episodes}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Aired:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.first_air_date === "" ? "TBA" : tv?.first_air_date}{" "}
                    {tv?.first_air_date === "" ? "" : "-"}{" "}
                    {tv?.last_air_date === null ? "" : tv?.last_air_date}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Original Network:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.networks?.map((network: any) => network?.name)}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Duration:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.episode_run_time[0]} min.
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Content Rating:{" "}
                  <span className="text-[16px] font-semibold">
                    {content?.results?.length === 0
                      ? "Not Yet Rated"
                      : content?.results?.map((rating: any) => rating.rating)}
                  </span>
                </h1>
                <h1 className="text-lg font-bold pr-2">
                  Status:{" "}
                  <span className="text-[16px] font-semibold">
                    {tv?.status === "Returning Series" ? "Ongoing" : tv?.status}
                  </span>
                </h1>
              </div>
            </div>
            <div className="border border-slate-300 dark:border-[#272727] dark:bg-[#242424] h-full rounded-md mt-5">
              <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4 rounded-t-md">
                Statistics:
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2">Score:</h1>
                  <p className="font-semibold">
                    {tv?.vote_average.toFixed(2)}{" "}
                    {tv?.vote_average === 0
                      ? ""
                      : `(scored by ${tv?.vote_count} ${
                          tv?.vote_count < 2 ? " user" : " users"
                        })`}
                  </p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2">Ranked:</h1>
                  <p className="font-semibold">#{!rank ? "10000+" : rank}</p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2">Popularity:</h1>
                  <p className="font-semibold">#{tv?.popularity}</p>
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
