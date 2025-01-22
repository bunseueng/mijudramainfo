"use client";

import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Image from "next/image";
import { DramaDB, UserProps } from "@/helper/type";
import dynamic from "next/dynamic";
import CastCard from "@/app/component/ui/Card/CastCard";
import AllSeason from "./AllSeason";
import ReviewCard from "@/app/component/ui/Card/ReviewCard";
import TvInfo from "./TvInfo";
import TvListCard from "@/app/component/ui/Card/TvListCard";
import { useQuery } from "@tanstack/react-query";
import { fetchTvWatchProvider } from "@/app/actions/fetchMovieApi";
import { useEffect, useState } from "react";

const WatchProvider = dynamic(() => import("./WatchProvider"), { ssr: false });

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
  lists,
  keyword,
}: any) => {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const { data: watchProvider } = useQuery({
    queryKey: ["watchProvider", tv?.id],
    queryFn: () => fetchTvWatchProvider(tv?.id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const seasons = tv?.seasons?.map((drama: any) => drama);

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
  const uniqueChanges = Array.from(
    new Map(
      getDrama?.changes.map((change: DramaDB) => [change.userId, change])
    ).values()
  );

  const userContributions = getDrama?.changes?.reduce(
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
  if (!tv || !language || !allTvShows || !review || !image) {
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
              href={`/tv/${tv_id}/cast`}
              className="text-md md:text-lg font-bold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
            <CastCard getDrama={getDrama} cast={cast} />
          </div>

          {tv?.homepage !== "" && selectedProvider && (
            <div className="border-t-[1px] border-slate-400 mt-7 mx-2 md:mx-0">
              <h1 className="text-lg text-black dark:text-white font-bold my-5">
                <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4"></span>
                Where to watch {tv?.name}
              </h1>
              <WatchProvider
                tv={tv}
                getDrama={getDrama}
                watchProvider={watchProvider}
                selectedProvider={selectedProvider}
              />
            </div>
          )}

          <AllSeason
            displaySeason={displaySeason}
            firstSeason={firstSeason}
            tv={tv}
            getYearFromDate={getYearFromDate}
          />
          <div className="border-b-[1px] border-b-slate-400 pb-5 mt-5 mx-2 md:mx-0"></div>
          <div className="pb-5 mx-2 md:mx-0">
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
          {keyword?.results?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg">Keywords</h1>
              <div className="flex flex-wrap w-full">
                {keyword?.results?.map((k: any) => {
                  return (
                    <div
                      className="text-sm bg-[#d7d7d7] text-black border border-[#d7d7d7] rounded-sm px-1 my-1 mr-1"
                      key={k?.id}
                    >
                      <ul>
                        <li>
                          <Link href={`/keyword/${k?.id}/tv`}>{k?.name}</Link>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tv?.networks?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg">Networks</h1>
              {tv?.networks?.map(
                (net: {
                  id: number;
                  name: string;
                  logo_path: string;
                  origin_country: string;
                }) => (
                  <div className="block mt-5" id={`${net?.id}`} key={net?.id}>
                    <Link
                      prefetch={false}
                      href={`/network/${net?.id}`}
                      className="inline-block"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${net?.logo_path}`}
                        alt={net?.name}
                        width={200}
                        height={200}
                        quality={100}
                        loading="lazy"
                        className="w-[200px] object-cover bg-center text-white"
                      />
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
          {sortedChanges?.length > 0 && (
            <div className="my-5">
              <h1 className="font-bold text-lg">Top Contributors</h1>
              {sortedChanges?.slice(0, 4)?.map((drama: any) => {
                const getUser = users?.find((users: UserProps) =>
                  users?.id?.includes(drama?.userId)
                );
                const userContributions = getDrama?.changes?.reduce(
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
                  <div className="flex items-center py-2" key={drama?.id}>
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
            <div className="mt-5">
              <TvListCard list={lists} movieId={[]} tvId={tv_id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DramaCast;
