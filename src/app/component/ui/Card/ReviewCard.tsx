"use client";

import Discuss from "@/app/(route)/(id)/tv/[id]/discuss/Discuss";
import MediaPage from "@/app/(route)/(id)/tv/[id]/media/page";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";
import { IoHeartSharp } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { TiStar } from "react-icons/ti";

const ReviewCard = ({
  review,
  image,
  video,
  tv_id,
  recommend,
  tv,
  user,
  users,
  getComment,
}: any) => {
  const [mediaActive, setMediaActive] = useState<string>("videos");
  const [openTrailer, setOpenTrailer] = useState<boolean>(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const api = "AIzaSyD18uVRSrbsFPx6EA8n80GZDt3_srgYu8A";

  const toggleExpand = (index: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    try {
      const fetchThumbnails = async () => {
        if (video?.results) {
          const keys = video.results.map((item: any) => item.key);
          const promises = keys.map((key: string) =>
            fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${key}&key=${api}`
            ).then((response) => response.json())
          );

          try {
            const responses = await Promise.all(promises);
            const thumbnailsData = responses.map(
              (response: any) => response.items[0].snippet.thumbnails.medium.url
            );
            setThumbnails(thumbnailsData);
          } catch (error) {
            console.error("Error fetching thumbnails:", error);
          }
        }
      };

      fetchThumbnails();
    } catch (error) {
      console.error("Error fetching thumbnails:", error);
    }
  }, [video]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MediaPage
          tv={tv}
          mediaActive={mediaActive}
          setMediaActive={setMediaActive}
          image={image}
          video={video}
          thumbnails={thumbnails}
          openTrailer={openTrailer}
          setOpenTrailer={setOpenTrailer}
          tv_id={tv_id}
        />
      </Suspense>
      <div className="relative top-0 left-0 mt-5 overflow-hidden">
        <h1 className="text-2xl font-bold py-4">Recommendations</h1>
        {recommend?.results?.length === 0 ? (
          <p className="text-xl font-bold py-5">
            There no recommendations for {tv?.name} yet !
          </p>
        ) : (
          <div
            className={`flex items-center overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4 ${
              recommend?.results?.length === 0 ? "hidden" : "flex"
            }`}
          >
            {recommend?.results?.map((item: any, index: number) => (
              <div className="w-[270px] h-[180px] mr-4" key={index}>
                <div className="w-[270px] h-[180px] bg-cover">
                  <Link
                    href={`/tv/${item?.id}`}
                    className="hover:relative transform duration-100 group"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${item?.backdrop_path}`}
                      alt="tv image"
                      width={600}
                      height={600}
                      className="rounded-lg"
                    />

                    <div className="absolute bg-slate-100 opacity-80 w-full bottom-0 px-2 py-2 invisible group-hover:visible">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center dark:text-black">
                          <LuCalendarClock className="mr-2" />
                          <span>{item?.first_air_date}</span>
                        </p>
                        <div className="flex items-center">
                          <IoHeartSharp className="dark:text-black" />
                          <FaBookmark
                            size={15}
                            className="mx-2 dark:text-black"
                          />
                          <TiStar size={25} className="dark:text-black" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="truncate">{item?.name}</p>
                    <p>{Math.round(item?.vote_average * 10)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-[1px] border-t-slate-400 pt-3 mt-10">
        {review?.results?.length === 0 ? (
          <p className="py-5 font-semibold">
            We dont have any reviews for In Blossom. Would you like to write
            one?
          </p>
        ) : (
          <div className="border-[1px] border-[#00000024] rounded-md mt-8">
            <div className="flex items-center justify-between text-[#176093] bg-[#a5dafa] px-5 py-2">
              <h1 className="text-md font-bold">Reviews</h1>
              <Link href="" className="text-md">
                Write Review
              </Link>
            </div>
            {review?.results?.slice(0, 2)?.map((review: any, idx: number) => {
              const dateObject = new Date(review?.updated_at);
              const formattedDate = dateObject.toLocaleDateString("en-US", {
                month: "long", // Display full month name
                day: "2-digit", // Display two-digit day
                year: "numeric", // Display full year
              });
              return (
                <div className="flex flex-col" key={idx}>
                  <div className="flex bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
                    {review.author_details?.avatar_path === null ? (
                      <Image
                        src="/default-pf.jpg"
                        alt="profile image"
                        width={100}
                        height={100}
                        className="size-[50px] object-cover rounded-full border-2 border-slate-500"
                      />
                    ) : (
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${review.author_details?.avatar_path}`}
                        alt="profile image"
                        width={100}
                        height={100}
                        className="size-[50px] object-cover rounded-full"
                      />
                    )}

                    <div className="flex flex-col text-black pl-5">
                      <h1 className="text-black dark:text-white text-sm md:text-md">
                        Review by {review?.author_details?.username}
                      </h1>
                      <div className="flex flex-col md:flex-row md:items-center md:pt-2">
                        {review?.author_details.rating && (
                          <h1 className="w-[60px] text-black dark:text-white bg-black p-1 rounded-full flex flex-row items-center mr-2 my-2 md:my-0">
                            <BsStars className="text-white" size={15} />
                            <span className="text-white text-xs px-2">
                              {review?.author_details.rating?.toFixed(1)}
                            </span>
                          </h1>
                        )}

                        <p className="text-black dark:text-white text-sm font-semibold">
                          Written by {review?.author_details?.username} on{" "}
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="bg- dark:bg-[#242526] p-5">
                    {expandedReviews.has(idx)
                      ? review?.content
                      : `${review?.content?.slice(0, 500)}...`}
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="pl-1 font-bold text-[#0275d8]"
                    >
                      {expandedReviews.has(idx) ? "Show Less" : "Read More"}
                    </button>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t-[1px] border-t-slate-400 pt-10 mt-10">
        <h1 className="text-xl font-bold">Social</h1>
        <Discuss
          user={user}
          users={users}
          getComment={getComment}
          tv_id={tv_id}
        />
      </div>
    </div>
  );
};

export default ReviewCard;
