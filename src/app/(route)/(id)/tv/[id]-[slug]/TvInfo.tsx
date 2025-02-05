import { formatDate } from "@/app/actions/formatDate";
import {
  DramaDetails,
  DramaProduction,
  DramaReleasedInfo,
} from "@/helper/type";
import React from "react";

const TvInfo = ({ getDrama, tv, content, allTvShows }: any) => {
  const [info]: DramaReleasedInfo[] = (getDrama?.released_information ||
    []) as unknown as DramaReleasedInfo[];
  const [detail]: DramaDetails[] = (getDrama?.details ||
    []) as unknown as DramaDetails[];
  const [production]: DramaProduction[] = (getDrama?.production_information ||
    []) as unknown as DramaProduction[];
  const formattedFirstAirDate = tv?.first_air_date
    ? formatDate(tv.first_air_date)
    : "TBA";
  const formattedLastAirDate = tv?.last_air_date
    ? formatDate(tv.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const formattedLastAirDateDB = info?.end_date
    ? formatDate(info.end_date)
    : "";
  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];
  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === tv.id
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
              Drama:
            </h1>
            {detail?.title || tv?.title || tv?.name}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Country:
            </h1>

            {detail?.country || tv?.type[0]}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Episode:
            </h1>

            {detail?.episode || tv?.number_of_episodes}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Aired:
            </h1>
            {getDrama?.released_information?.length > 0
              ? formattedLastAirDate
                ? `${formattedFirstAirDateDB} - ${formattedLastAirDateDB}`
                : `${formattedFirstAirDateDB} - ${formattedLastAirDateDB}`
              : formattedLastAirDateDB
              ? `${formattedFirstAirDate} - ${formattedLastAirDate}`
              : formattedFirstAirDate}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Airs On:
            </h1>
            {info?.broadcast?.length > 0
              ? info?.broadcast?.map((broad) => broad?.day)?.join(", ")
              : "?"}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Original Network:{" "}
            </h1>
            {production?.network?.map((net) => net?.value).join(", ") ||
              tv?.networks
                ?.map((network: DramaReleasedInfo) => network?.name)
                ?.join(", ")}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Duration:
            </h1>

            {detail?.duration || tv?.episode_run_time?.[0]}
            {tv?.episode_run_time?.length || detail?.duration > 0
              ? "min."
              : "Duration not yet added"}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Content Rating:
            </h1>
            {detail?.content_rating ? (
              <span>{detail?.content_rating}</span>
            ) : (
              <span>
                {content?.length === 0
                  ? "Not Yet Rated"
                  : content && content[0]?.rating}
                {content?.length !== 0 && (
                  <span>
                    + - Teens {content && content[0]?.rating} or older
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="pb-1 break-words text-sm">
            <h1 className="inline-block text-sm lg:text-[15px] font-bold pr-1 lg:pr-2">
              Status:
            </h1>

            {detail?.status
              ? detail?.status
              : tv?.status === "Returning Series"
              ? "Ongoing"
              : tv?.status}
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
            {tv?.vote_average?.toFixed(1)}{" "}
            {tv?.vote_average === 0
              ? ""
              : `(scored by ${tv?.vote_count} ${
                  tv?.vote_count < 2 ? " user" : " users"
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
            #{tv?.popularity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvInfo;
