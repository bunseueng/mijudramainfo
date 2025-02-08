"use client";

import CastCard from "@/app/component/ui/Card/CastCard";
import TvListCard from "@/app/component/ui/Card/TvListCard";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { DramaDB, UserProps } from "@/helper/type";
import MovieInfo from "./MovieInfo";
import WatchProvider from "../../tv/[id]-[slug]/WatchProvider";
import MovieReviewCard from "@/app/component/ui/Card/MovieReviewCard";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";
import WatchNowButton2 from "@/app/component/ui/Button/WatchNowButton2";

const MovieCast = ({
  cast,
  movie,
  allTvShows,
  movie_id,
  review,
  image,
  video,
  recommend,
  user,
  users,
  getComment,
  getReview,
  getMovie,
  lists,
  keyword,
  certification,
}: any) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const watchProvider = movie["watch/providers"]?.results;
  const uniqueChanges = Array.from(
    new Map(
      getMovie?.changes.map((change: DramaDB) => [change.userId, change])
    ).values()
  );
  const userContributions = getMovie?.changes?.reduce(
    (acc: number[], change: any) => {
      // Increment the count of changes for each userId
      acc[change.userId] = (acc[change.userId] || 0) + 1;
      return acc;
    },
    {}
  );

  // Step 2: Sort the uniqueChanges based on the number of contributions for each userId
  const sortedChanges = uniqueChanges?.sort((a: any, b: any) => {
    // Get the count of contributions for userId in `a` and `b`
    const countA = userContributions[a.userId] || 0;
    const countB = userContributions[b.userId] || 0;

    // Sort in descending order, i.e., users with more contributions come first
    return countB - countA;
  });

  // Function to get user country based on IP
  const getUserCountry = async () => {
    try {
      const res = await fetch("https://ipinfo.io/json?token=80e3bb75bb316a", {
        method: "GET",
      });
      const data = await res.json();
      return data.country; // e.g., "US"
    } catch (error) {
      console.error("Error fetching user location:", error);
      return null;
    }
  };

  // Fetch user location and set the watch provider
  useEffect(() => {
    const fetchCountryAndSetProvider = async () => {
      const country = await getUserCountry();

      if (country && watchProvider && watchProvider[country]) {
        setSelectedProvider(watchProvider[country]);
      } else {
        setSelectedProvider(watchProvider?.US); // Default to US if no match
      }
    };

    fetchCountryAndSetProvider();
  }, [watchProvider]);

  if (!movie || !review || !image) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto md:py-8 md:px-2 lg:px-5 mt-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start">
        <div className="relative float-left w-full md:w-2/3 md:px-5 lg:px-0">
          <div className="lg:w-[92%] flex items-center justify-between content-center px-2 lg:px-0">
            <div className="flex items-center">
              <h1 className="text-lg md:text-2xl font-bold">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Cast & Credits
              </h1>
              <FaArrowAltCircleRight size={30} className="ml-2 font-bold" />
            </div>
            <Link
              prefetch={false}
              href={`/movie/${movie_id}/cast`}
              className="text-md md:text-lg font-bold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
            <CastCard getDrama={getMovie} cast={cast} />
          </div>

          {movie?.homepage !== "" && selectedProvider && (
            <div className="border-t-[1px] border-slate-400 mt-7 mx-2 md:mx-0">
              <h1 className="text-lg text-black dark:text-white font-bold my-5">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Where to watch {movie?.title}
              </h1>
              <WatchProvider
                tv={movie}
                getDrama={getMovie}
                watchProvider={watchProvider}
                selectedProvider={selectedProvider}
              />
            </div>
          )}
          <div className="border-b-[1px] border-b-slate-400 pb-5 mt-5 mx-2 md:mx-0"></div>
          <div className="pb-5 mx-2 md:mx-0">
            <MovieReviewCard
              user={user}
              users={users}
              review={review}
              image={image}
              video={video}
              movie_id={movie_id}
              recommend={recommend}
              movie={movie}
              getComment={getComment}
              getReview={getReview}
            />
          </div>
        </div>
        <div className="hidden md:block float-left relative md:w-1/3 px-2 md:px-0 lg:px-2 my-5 md:my-0 lg:ml-5">
          <div className="mb-4">
            <WatchNowButton2 link={`/movie/${movie?.id}/watch`} />
          </div>
          <MovieInfo
            getMovie={getMovie}
            movie={movie}
            allTvShows={allTvShows}
            certification={certification}
          />
          {keyword?.keywords?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg mb-3">Keywords</h1>
              <div className="flex flex-wrap w-full">
                {keyword?.keywords?.map((k: any, idx: number) => {
                  return (
                    <div
                      className="text-sm bg-[#d7d7d7] text-black border border-[#d7d7d7] rounded-sm px-1 my-1 mr-1"
                      key={idx}
                    >
                      <ul>
                        <li>
                          <Link href={`/keyword/${k?.id}/movie`}>
                            {k?.name}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {sortedChanges?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg">Top Contributors</h1>
              {sortedChanges?.slice(0, 4)?.map((drama: any, idx) => {
                const getUser = users?.find((users: UserProps) =>
                  users?.id?.includes(drama?.userId)
                );
                const userContributions = getMovie?.changes?.reduce(
                  (acc: number[], change: any) => {
                    // If userId exists in the accumulator, increment the count, otherwise set it to 1
                    acc[change.userId] = (acc[change.userId] || 0) + 1;
                    return acc;
                  },
                  {}
                );
                const userContributeCount =
                  userContributions[drama.userId] || 0;

                return (
                  <div className="flex items-center py-2" key={idx}>
                    <div className="block">
                      <Image
                        src={getUser?.profileAvatar || getUser?.image}
                        alt={getUser?.displayName || getUser?.name}
                        width={100}
                        height={100}
                        loading="lazy"
                        className="size-[40px] object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col pl-2">
                      <p className="text-[#2196f3]">
                        {getUser?.displayName || getUser?.name}
                      </p>
                      <p className="text-sm">{userContributeCount} edits</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="my-5">
            <h1 className="font-bold text-lg">Popular Lists</h1>
            <div className="mt-3">
              <TvListCard list={lists} movieId={movie_id} tvId={[]} />
            </div>
          </div>
          <div className="w-full h-screen bg-gray-200 dark:bg-black my-10">
            <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCast;
