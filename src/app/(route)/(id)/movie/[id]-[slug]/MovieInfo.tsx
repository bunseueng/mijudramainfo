import { formatDate } from "@/app/actions/formatDate";
import { formatDuration } from "@/app/actions/formattedDuration";
import { DramaDetails, DramaReleasedInfo } from "@/helper/type";
import React from "react";

const MovieInfo = ({ getMovie, movie, allmovieShows }: any) => {
  const [detail]: DramaDetails[] = (getMovie?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (getMovie?.released_information ||
    []) as unknown as DramaReleasedInfo[];
  const formattedLastAirDate = movie?.last_air_date
    ? formatDate(movie.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const allmovieShowsArray = Array.isArray(allmovieShows) ? allmovieShows : [];
  // Find the index of the matched movie show in allmovieShows array
  const matchedIndex = allmovieShowsArray.findIndex(
    (show: any) => show.id === movie.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  return (
    <div>
      <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full rounded-lg">
        <h1 className="text-white text-md font-bold bg-cyan-600 px-4 py-2 rounded-t-md">
          Details:
        </h1>
        <div className="flex flex-col p-4 pb-1">
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Movie:
            </h1>
            {detail?.title || movie?.title || movie?.name}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Country:
            </h1>

            {detail?.country || movie?.type[0]}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Airs On:
            </h1>
            {getMovie?.released_information?.length > 0
              ? formattedLastAirDate
                ? `${formattedFirstAirDateDB}`
                : formattedFirstAirDateDB
              : movie?.release_date}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Budget:{" "}
            </h1>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(movie.budget)}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Revenue:{" "}
            </h1>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(movie.revenue)}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Duration:
            </h1>

            {detail?.duration || movie?.runtime
              ? formatDuration(movie?.runtime)
              : "Duration not yet added."}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Status:
            </h1>

            {detail?.status || movie?.status === "Returning Series"
              ? "Ongoing"
              : movie?.status}
          </div>
        </div>
      </div>
      <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full mt-5 rounded-lg">
        <h1 className="text-white text-md font-bold bg-cyan-600 rounded-t-md px-4 py-2">
          Statistics:
        </h1>
        <div className="flex flex-col p-4 pb-1">
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Score:
            </h1>
            {movie?.vote_average?.toFixed(1)}{" "}
            {movie?.vote_average === 0
              ? ""
              : `(scored by ${movie?.vote_count} ${
                  movie?.vote_count < 2 ? " user" : " users"
                })`}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Ranked:
            </h1>
            #{!rank ? "10000+" : rank}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Popularity:
            </h1>
            #{movie?.popularity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
