import LazyImage from "@/components/ui/lazyimage";
import Link from "next/link";
import React from "react";
import { FaCalendarDays } from "react-icons/fa6";

const AllSeason = ({
  displaySeason,
  firstSeason,
  getYearFromDate,
  tv,
}: any) => {
  return (
    <div className="border-t-[1px] border-slate-400 mt-7 mx-2 md:mx-0">
      <h1 className="text-2xl text-black dark:text-white font-bold my-5">
        <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
        {displaySeason?.name || firstSeason?.name}
      </h1>
      <div className="w-full h-full md:flex-row">
        <div className="flex flex-col md:flex-row border border-slate-400 rounded-lg">
          <Link
            prefetch={true}
            href={`${tv.id}/seasons/${
              displaySeason?.season_number || firstSeason?.season_number
            }`}
            className="w-full md:w-[20%] h-[200px] md:h-auto cursor-pointer"
          >
            <LazyImage
              src={
                displaySeason?.backdrop_path ||
                displaySeason?.poster_path ||
                firstSeason?.backdrop_path ||
                firstSeason?.poster_path ||
                tv?.backdrop_path ||
                tv?.poster_path
              }
              w="w780"
              alt={`${
                displaySeason?.name ||
                displaySeason?.title ||
                firstSeason?.name ||
                firstSeason?.title ||
                tv?.name ||
                tv?.title
              }' Poster`}
              width={500}
              height={300}
              quality={100}
              priority
              className="block align-middle w-full h-[200px] md:h-auto object-cover rounded-lg"
            />
          </Link>
          <div className="w-full md:w-[80%] flex flex-col items-start px-5 pt-5 pb-3 md:pb-0 md:pt-2">
            <Link
              prefetch={true}
              href={`${tv.id}/seasons/${
                displaySeason?.season_number || firstSeason?.season_number
              }`}
              className="w-[20%] cursor-pointer"
            >
              {displaySeason?.name || firstSeason?.name}
            </Link>
            <h4 className="text-xs md:text-md font-semibold">
              {getYearFromDate(
                displaySeason?.air_date || firstSeason?.air_date
              )}{" "}
              -
              <span>
                {displaySeason?.episode_count || firstSeason?.episode_count}{" "}
                Episode
              </span>
            </h4>
            <p className="pt-4 text-xs md:text-sm font-semibold">
              {displaySeason?.overview ||
              firstSeason?.overview ||
              firstSeason?.overview === "" ? (
                <>
                  {displaySeason?.overview ||
                    firstSeason?.overview ||
                    (firstSeason !== "" && tv?.overview)}
                </>
              ) : (
                <span>
                  Overview has not been add to this season. Please contact us!
                </span>
              )}
            </p>
            <p className="flex items-center font-semibold text-xs md:text-base mt-3">
              <FaCalendarDays className="mr-2" />{" "}
              <span className="border-b-[1px] border-b-black dark:border-b-[#2196f3]">
                {displaySeason?.episode_count || firstSeason?.episode_count}{" "}
                Episode
              </span>
              <span className="px-2">
                (1x
                {displaySeason?.episode_count ||
                  firstSeason?.episode_count},{" "}
                {displaySeason?.air_date || firstSeason?.air_date})
              </span>
              <span>
                {tv?.last_episode_to_air?.episode_type === "standard"
                  ? "Ongoing"
                  : tv?.last_episode_to_air?.episode_type === "finale" &&
                    "Final"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSeason;
