import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import LazyImage from "@/components/ui/lazyimage";
import { formatDate } from "@/app/actions/formatDate";

interface ReviewItemProps {
  review: any;
  tv: any;
  idx: number;
  currentUser: any;
  expandedReviews: Set<number>;
  loadingStates: { [key: string]: boolean };
  toggleExpand: (idx: number) => void;
  submitReviewHelpful: (feedback: string, reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  tv,
  idx,
  currentUser,
  expandedReviews,
  loadingStates,
  toggleExpand,
  submitReviewHelpful,
}) => {
  const isCurrentUserReviewd = review?.reviewBy?.some((data: any) =>
    currentUser?.id?.includes(data?.userId)
  );
  const isCurrentUserReviewdAction = review?.reviewBy?.find((data: any) =>
    currentUser?.id?.includes(data?.userId)
  );
  const isLongReview = review?.review?.length > 500;

  return (
    <div id={review?.id} className="flex flex-col">
      {/* Review Header */}
      <div className="bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Image
              src={`${
                review?.userInfo?.profileAvatar || review?.userInfo?.image
              }`}
              alt={
                `${review?.userInfo?.displayName || review?.userInfo?.name}` ||
                "User Profile"
              }
              width={50}
              height={50}
              quality={100}
              loading="lazy"
              className="size-[25px] md:size-[50px] object-cover rounded-full"
            />
            <div className="flex flex-col text-black pl-2">
              <Link
                prefetch={false}
                href={`/profile/${review?.userInfo?.name}`}
                className="w-auto text-[#2490da] text-xs md:text-md pb-1 cursor-default"
              >
                <span className="cursor-pointer">
                  {review?.userInfo?.displayName || review?.userInfo?.name}
                </span>
              </Link>
              <Link
                prefetch={false}
                href={`/profile/${review?.userInfo?.name}/reviews`}
                className="text-[#2490da] text-xs md:text-md pb-1"
              >
                Other reviews by this user
              </Link>
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

      {/* Review Content */}
      <div className="px-4">
        <div className="-mx-4">
          <div className="relative float-left w-full overflow-hidden break-words">
            {/* Rating Scores */}
            <div className="grid grid-cols-2 md:flex md:items-start md:justify-center border border-slate-400 md:border-0 border-b border-b-slate-400 border-t border-t-slate-400 md:py-1">
              {/* Rating components (Story, Acting, Music, etc.) */}
              {/* ... Add rating score components here ... */}
            </div>

            {/* Review Text */}
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-black dark:text-white text-xs md:text-sm font-semibold">
                {review?.reviewHelpful} people found this review helpful
              </p>
              {review?.spoiler === true && (
                <p className="text-xs md:text-sm text-[#cc3737] text-right font-bold pb-1">
                  This review may contain spoilers
                </p>
              )}
            </div>

            {/* Review Image */}
            <div className="relative float-right border border-[#00000024] rounded-sm m-2">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  tv?.poster_path ? "w154" : "w300"
                }/${tv.poster_path || tv.backdrop_path}`}
                alt={`${tv?.name || tv?.title}` || "Drama Poster"}
                width={100}
                height={150}
                quality={100}
                priority
                className="w-[100px] h-[150px] object-cover rounded-md"
              />
            </div>

            {/* Review Content */}
            <p className="text-xs md:text-sm font-bold p-3">
              {review?.headline}
            </p>
            <p className="review-content text-[#333] dark:text-white text-xs md:text-sm px-3">
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

            {/* Helpful Buttons */}
            {(!isLongReview || expandedReviews?.has(idx)) && (
              <div className="text-sm px-3">
                Was this review helpful to you? {/* Yes Button */}
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
                {/* No Button */}
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
                {/* Cancel Button */}
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
                    onClick={() => submitReviewHelpful("Cancel", review?.id)}
                    disabled={
                      loadingStates[`${review.id}-Cancel`] ||
                      isCurrentUserReviewdAction?.action === "Cancel"
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
};

export default ReviewItem;
