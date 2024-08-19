import CastCard from "@/app/component/ui/Card/CastCard";
import Link from "next/link";
import React from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import AllSeason from "./AllSeason";
import ReviewCard from "@/app/component/ui/Card/ReviewCard";
import WatchProvider from "./WatchProvider";

const DramaCast = ({
  getDrama,
  cast,
  tv,
  content,
  language,
  allTvShows,
  tv_id,
  review,
  image,
  video,
  recommend,
  user,
  getComment,
  users,
}: any) => {
  const original_country = tv?.origin_country?.[0];

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

  // Get Drama Season
  const seasons = tv?.seasons?.map((drama: any) => drama);

  if (!tv || !language || !allTvShows || !review || !image) {
    return null;
  }
  // Determine which season to display based on the number of seasons
  let displaySeason;
  if (seasons?.length === 1) {
    displaySeason = seasons;
  } else if (seasons?.length > 1) {
    displaySeason = seasons[seasons?.length - 1];
  }
  let firstSeason = seasons?.[0];
  const getYearFromDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <div className="max-w-[97rem] mx-auto md:py-8 md:px-5 mt-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start">
        <div className="w-full md:w-[70%]">
          <div className="lg:w-[92%] flex items-center justify-between content-center px-2 lg:px-0">
            <div className="flex items-center">
              <h1 className="text-lg md:text-2xl font-bold">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Cast & Credits
              </h1>
              <FaArrowAltCircleRight size={30} className="ml-2 font-bold" />
            </div>
            <Link
              href={`/tv/${tv_id}/cast`}
              className="text-md md:text-lg font-bold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
            <CastCard getDrama={getDrama} cast={cast} />
          </div>

          <div className="border-t-2 border-slate-400 mt-7 mx-2 md:mx-0">
            <h1 className="text-lg text-black dark:text-white font-bold my-5">
              <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
              Where to watch {tv?.name}
            </h1>
            <WatchProvider getDrama={getDrama} />
          </div>
          <AllSeason
            displaySeason={displaySeason}
            firstSeason={firstSeason}
            tv={tv}
            getYearFromDate={getYearFromDate}
          />
          <div className="border-b-2 border-b-slate-500 pb-5 mt-5 mx-2 md:mx-0">
            <Link href={`/tv/${tv_id}/seasons`} className="text-lg font-bold">
              View all seasons
            </Link>
          </div>
          <div className="py-5 mx-2 md:mx-0">
            <ReviewCard
              user={user}
              users={users}
              review={review}
              image={image}
              video={video}
              tv_id={tv_id}
              recommend={recommend}
              tv={tv}
              getComment={getComment}
            />
          </div>
        </div>
        <div className="hidden  md:block px-2 md:w-[30%] my-5 md:my-0 lg:ml-5">
          <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full rounded-md">
            <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4 rounded-t-md">
              Details:
            </h1>
            <div className="flex flex-col p-4 pb-1">
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Drama:
                </h1>
                <p className="text-sm font-semibold">{tv?.title || tv?.name}</p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Country:
                </h1>
                <p className="text-sm font-semibold">
                  {matchedLanguage?.english_name}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Episode:
                </h1>
                <p className="text-sm font-semibold">
                  {tv?.number_of_episodes}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Aired:
                </h1>
                <p className="text-sm font-semibold">
                  {tv?.first_air_date === "" ? "TBA" : tv?.first_air_date}{" "}
                  {tv?.first_air_date === "" ? "" : "-"}{" "}
                  {tv?.last_air_date === null ? "" : tv?.last_air_date}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Original Network:{" "}
                  <span className="text-sm font-semibold">
                    {tv?.networks?.map((network: any, index: number) => {
                      return index === network.length - 1
                        ? network.name
                        : network.name + ", ";
                    })}
                  </span>
                </h1>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Duration:
                </h1>
                <p className="text-sm font-semibold">
                  {tv?.episode_run_time?.[0]}
                  {tv?.episode_run_time?.length > 0
                    ? "min."
                    : "Duration not yet added"}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Content Rating:
                </h1>
                <p className="text-sm font-semibold">
                  {content?.results?.length === 0
                    ? "Not Yet Rated"
                    : content?.results[0]?.rating}
                  {content?.results?.length !== 0 && (
                    <span>
                      + - Teens {content?.results[0]?.rating} or older
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Status:
                </h1>
                <p className="text-sm font-semibold">
                  {tv?.status === "Returning Series" ? "Ongoing" : tv?.status}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full mt-5 rounded-md">
            <h1 className="text-white text-2xl font-bold bg-cyan-600 rounded-t-md p-4">
              Statistics:
            </h1>
            <div className="flex flex-col p-4 pb-1">
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Score:
                </h1>
                <p className="text-sm font-semibold">
                  {tv?.vote_average?.toFixed(1)}{" "}
                  {tv?.vote_average === 0
                    ? ""
                    : `(scored by ${tv?.vote_count} ${
                        tv?.vote_count < 2 ? " user" : " users"
                      })`}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Ranked:
                </h1>
                <p className="text-sm font-semibold">
                  #{!rank ? "10000+" : rank}
                </p>
              </div>
              <div className="flex items-center pb-1">
                <h1 className="text-sm lg:text-[15px] font-bold pr-2">
                  Popularity:
                </h1>
                <p className="text-sm font-semibold">#{tv?.popularity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DramaCast;
