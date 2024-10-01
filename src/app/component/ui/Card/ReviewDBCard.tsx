"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { formatDate } from "@/app/actions/formatDate";
import { ITvReview } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoLogoWechat } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const ReviewDBCard = ({ getReview, tv_id, user }: any) => {
  const { data: tv, isLoading } = useQuery({
    queryKey: ["tv", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const setButtonLoading = (
    reviewId: string,
    buttonType: string,
    isLoading: boolean
  ) => {
    setLoadingStates((prev) => ({
      ...prev,
      [`${reviewId}-${buttonType}`]: isLoading,
    }));
  };

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

  const submitReviewHelpful = async (feedback: string, reviewId: string) => {
    setButtonLoading(reviewId, feedback, true);
    try {
      const res = await fetch(`/api/tv/${tv_id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
        }),
      });

      if (res.status === 200) {
        toast.success("Success ");
        router.refresh();
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 404) {
        toast.error("Invalid Tv");
      }
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    } finally {
      setButtonLoading(reviewId, feedback, false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {getReview?.slice(0, 2)?.map((review: ITvReview, idx: number) => {
        const isCurrentUserReviewd = review?.reviewBy?.some((data) =>
          user?.id?.includes(data?.userId)
        );
        const isCurrentUserReviewdAction = review?.reviewBy?.find((data) =>
          user?.id?.includes(data?.userId)
        );
        const isLongReview = review?.review?.length > 500;
        return (
          <div id={review?.id} className="flex flex-col" key={review?.id}>
            <div className=" bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Image
                    src={`${
                      review?.userInfo?.profileAvatar || review?.userInfo?.image
                    }`}
                    alt={`${
                      review?.userInfo?.displayName || review?.userInfo?.name
                    }`}
                    width={100}
                    height={100}
                    loading="lazy"
                    className="size-[25px] md:size-[50px] object-cover rounded-full"
                  />

                  <div className="flex flex-col text-black pl-2">
                    <Link
                      prefetch={true}
                      href={`/person/${review?.userId}`}
                      className="text-[#2490da] text-xs md:text-md"
                    >
                      {review?.userInfo?.displayName || review?.userInfo?.name}
                    </Link>
                    <Link href="" className="text-[#2490da] text-xs md:text-md">
                      Other reviews by this user
                    </Link>{" "}
                  </div>
                </div>
                <div className="block">
                  <label
                    htmlFor="review_date"
                    className="text-xs md:text-sm font-semibold"
                  >
                    Review Date:
                  </label>
                  <p className="text-xs text-right text-[#999] pb-1">
                    {formatDate(review?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4">
              <div className="-mx-4">
                <div className="relative float-left w-full overflow-hidden break-words">
                  <div className="grid grid-cols-2 md:flex md:justify-center md:items-center border border-slate-400 md:border-0 md:border-b md:border-b-slate-400  md:border-t md:border-t-slate-400 md:py-1">
                    <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                      <label
                        htmlFor="story"
                        className="text-xs md:text-sm font-bold"
                      >
                        Story
                      </label>
                      <p className="text-xs md:text-base">
                        {review?.rating_score?.story}
                      </p>
                    </div>
                    <div className="flex flex-col items-center md:border-r md:border-r-slate-400 px-5">
                      <label
                        htmlFor="acting_cast"
                        className="text-xs md:text-sm font-bold"
                      >
                        Acting/Cast
                      </label>
                      <p className="text-xs md:text-base">
                        {review?.rating_score?.acting}
                      </p>
                    </div>
                    <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                      <label
                        htmlFor="music"
                        className="text-xs md:text-sm font-bold"
                      >
                        Music
                      </label>
                      <p className="text-xs md:text-base">
                        {review?.rating_score?.music}
                      </p>
                    </div>
                    <div className="flex flex-col items-center md:border-r md:border-r-slate-400 px-5">
                      <label
                        htmlFor="rewatch_value"
                        className="text-xs md:text-sm font-bold"
                      >
                        Rewatch Value
                      </label>
                      <p className="text-xs md:text-base">
                        {review?.rating_score?.rewatchValue}
                      </p>
                    </div>
                    <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                      <label
                        htmlFor="overall"
                        className="text-xs md:text-sm font-bold"
                      >
                        Overall
                      </label>
                      <p className="text-xs md:text-base">
                        {review?.overall_score}
                      </p>
                    </div>

                    <div className="flex flex-col items-center px-5">
                      {" "}
                      {review?.finishedWatching === false ? (
                        <p className="text-xs text-right text-[#818a91] pb-1">
                          {review?.episode} of {tv?.number_of_episodes} episodes
                          seen
                        </p>
                      ) : (
                        <p className="text-xs text-right text-[#818a91] pb-1">
                          {review?.episode} of {tv?.number_of_episodes} episodes
                          seen
                        </p>
                      )}
                      <div className="flex items-center text-end justify-end">
                        {review?.finishedWatching === false ? (
                          <>
                            {review?.dropping === true ? (
                              <p className="text-xs text-red-600 border border-red-600 rounded-md px-2 mr-2">
                                Dropped
                              </p>
                            ) : (
                              <p className="text-xs text-[#3a8ee6] border border-[#3a8ee6] rounded-md px-2 mr-2">
                                Ongoing
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-[#5cb85c] border border-[#5cb85c] rounded-md px-2 mr-2">
                            Completed
                          </p>
                        )}

                        <IoLogoWechat />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-black dark:text-white text-xs md:text-sm font-semibold">
                      {review?.reviewHelpful} people found this review helpful
                    </p>
                    {review?.spoiler === true && (
                      <p className="text-xs md:text-sm text-[#cc3737] font-bold pb-1">
                        This review may contain spoilers
                      </p>
                    )}
                  </div>
                  <div className="relative float-right border border-[#00000024] rounded-sm m-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${
                        tv.poster_path || tv.backdrop_path
                      }`}
                      alt={`${tv?.name || tv?.title}`}
                      width={100}
                      height={100}
                      priority
                      className="w-[100px] h-[150px] object-cover rounded-md"
                    />
                  </div>

                  <p className="text-sm font-bold p-3">{review?.headline}</p>
                  <p className="review-content text-[#333] dark:text-white text-sm px-3">
                    {review?.review?.length > 500 && !expandedReviews?.has(idx)
                      ? `${review?.review.slice(0, 500)}...`
                      : review?.review}
                    {review?.review?.length > 500 && (
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="text-md font-semibold text-[#0275d8] pl-1"
                      >
                        {expandedReviews?.has(idx) ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </p>
                  {(!isLongReview || expandedReviews?.has(idx)) && (
                    <div className="text-sm px-3">
                      Was this review helpful to you?{" "}
                      <button
                        type="button"
                        name="Yes"
                        className={`bg-white dark:bg-[#3a3b3c] border rounded hover:opacity-50 mt-4 ml-1 py-0.5 px-1 ${
                          isCurrentUserReviewdAction?.action === "Yes"
                            ? "text-[#71c151] border-[#92d07a]"
                            : "text-[#848484] border-[#cdcdcd] dark:border-[#3e4042]"
                        } ${
                          loadingStates[`${review.id}-Yes`] ||
                          isCurrentUserReviewdAction?.action === "Yes"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => submitReviewHelpful("Yes", review?.id)}
                        disabled={
                          loadingStates[`${review.id}-Yes`] ||
                          isCurrentUserReviewdAction?.action === "Yes"
                            ? true
                            : false
                        }
                      >
                        {loadingStates[`${review.id}-Yes`] ? (
                          <ClipLoader
                            color="#c0c4cc"
                            loading={loadingStates[`${review.id}-Yes`]}
                            size={10}
                            className="mx-1"
                          />
                        ) : (
                          "Yes"
                        )}
                      </button>
                      <button
                        type="button"
                        name="No"
                        className={`bg-white dark:bg-[#3a3b3c] border rounded hover:opacity-50 mt-4 ml-1 py-0.5 px-1 ${
                          isCurrentUserReviewdAction?.action === "No"
                            ? "text-[#71c151] border-[#92d07a]"
                            : "text-[#848484] border-[#cdcdcd] dark:border-[#3e4042]"
                        } ${
                          loadingStates[`${review.id}-No`] ||
                          isCurrentUserReviewdAction?.action === "No"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => submitReviewHelpful("No", review?.id)}
                        disabled={
                          loadingStates[`${review.id}-No`] ||
                          isCurrentUserReviewdAction?.action === "No"
                            ? true
                            : false
                        }
                      >
                        {loadingStates[`${review.id}-No`] ? (
                          <ClipLoader
                            color="#c0c4cc"
                            loading={loadingStates[`${review.id}-No`]}
                            size={10}
                            className="mx-1"
                          />
                        ) : (
                          "No"
                        )}
                      </button>
                      {isCurrentUserReviewd === true && (
                        <button
                          type="button"
                          name="Cancel"
                          className={`text-[#848484] bg-white dark:bg-[#3a3b3c] border border-[#cdcdcd] dark:border-[#3e4042] rounded hover:opacity-50 mt-4 ml-1 py-0.5 px-1 ${
                            loadingStates[`${review.id}-Cancel`] ||
                            isCurrentUserReviewdAction?.action === "Cancel"
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() =>
                            submitReviewHelpful("Cancel", review?.id)
                          }
                          disabled={
                            loadingStates[`${review.id}-Cancel`] ||
                            isCurrentUserReviewdAction?.action === "Cancel"
                              ? true
                              : false
                          }
                        >
                          {loadingStates[`${review.id}-Cancel`] ? (
                            <ClipLoader
                              color="#c0c4cc"
                              loading={loadingStates[`${review.id}-Cancel`]}
                              size={10}
                              className="mx-1"
                            />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="border-b border-b-[#78828c21]"></div>
      <div className="text-center px-4 py-2.5">
        <Link href={`/tv/${tv_id}/reviews`} className="text-[#1675b6] text-sm">
          View All
        </Link>
      </div>
    </div>
  );
};

export default ReviewDBCard;
