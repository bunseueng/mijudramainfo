import CastCard from "@/app/component/ui/Card/CastCard";
import Link from "next/link";
import React from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import AllSeason from "./AllSeason";
import ReviewCard from "@/app/component/ui/Card/ReviewCard";
import WatchProvider from "./WatchProvider";
import TvInfo from "./TvInfo";

const DramaCast = ({
  getDrama,
  cast,
  tv,
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
  getReview,
  content,
}: any) => {
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
    <div className="max-w-6xl mx-auto md:py-8 md:px-2 lg:px-5 mt-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start">
        <div className="relative float-left w-full md:w-2/3">
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

          {tv?.homepage !== "" && (
            <div className="border-t-[1px] border-slate-400 mt-7 mx-2 md:mx-0">
              <h1 className="text-lg text-black dark:text-white font-bold my-5">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Where to watch {tv?.name}
              </h1>
              <WatchProvider tv={tv} getDrama={getDrama} />
            </div>
          )}
          <AllSeason
            displaySeason={displaySeason}
            firstSeason={firstSeason}
            tv={tv}
            getYearFromDate={getYearFromDate}
          />
          <div className="border-b-[1px] border-b-slate-400 pb-5 mt-5 mx-2 md:mx-0">
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
              getReview={getReview}
            />
          </div>
        </div>
        <div className="hidden md:block float-left relative md:w-1/3 px-2 md:px-0 lg:px-2 my-5 md:my-0 lg:ml-5">
          <TvInfo
            getDrama={getDrama}
            language={language}
            tv={tv}
            content={content}
            allTvShows={allTvShows}
          />
        </div>
      </div>
    </div>
  );
};

export default DramaCast;
