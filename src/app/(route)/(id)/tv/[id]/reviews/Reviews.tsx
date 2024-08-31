"use client";

import {
  fetchAllPopularTvShows,
  fetchContentRating,
  fetchLanguages,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { currentUserProps, DramaDB, ITvReview } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import ColorThief from "colorthief";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import TvInfo from "../TvInfo";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { reviewLanguage, reviewStatus } from "@/helper/item-list";
import ClipLoader from "react-spinners/ClipLoader";
import { IoLogoWechat } from "react-icons/io5";
import { formatDate } from "@/app/actions/formatDate";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Pagination } from "@/app/component/ui/Pagination/pagination";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";

type ReviewType = {
  tv_id: string;
  getDrama: DramaDB | null;
  getReview: ITvReview[];
  currentUser: currentUserProps | null;
};

const Reviews: React.FC<ReviewType> = ({
  tv_id,
  getDrama,
  getReview,
  currentUser,
}) => {
  const { data: tv, isLoading } = useQuery({
    queryKey: ["movie", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: language } = useQuery({
    queryKey: ["tvLanguage", tv_id],
    queryFn: fetchLanguages,
  });
  const { data: content } = useQuery({
    queryKey: ["tvContent", tv_id],
    queryFn: () => fetchContentRating(tv_id),
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["tvCast", tv_id],
    queryFn: fetchAllPopularTvShows,
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>("");
  const [reviewType, setReviewType] = useState<string>("Most Helpful");
  const [languages, setLanguages] = useState<string>("All Languages");
  const [status, setStatus] = useState<string>("all_status");
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const per_page = Number(searchParams?.get("per_page")) || "10"; // Default to 10 items per page
  const initialPage = Number(searchParams?.get("page")) || 1; // Initial page from URL or default to 1
  const [page, setPage] = useState(initialPage);
  const start = (page - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalItems = getReview?.length;
  const currentItems = getReview?.slice(start, end);

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown(openDropdown === type ? "" : type);
  };

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

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief?.getColor(imgRef.current);
      setDominantColor(`rgb(${color.join(",")})`); // Set the dominant color in RGB format
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [tv]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tv) {
    return <SearchLoading />; // Add loading state if data is being fetched
  }
  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 py-2">
          <div className="flex items-center lg:items-start px-4 md:px-6 cursor-default">
            {tv?.poster_path || tv?.backdrop_path !== null ? (
              <Image
                ref={imgRef}
                onLoad={extractColor}
                src={`https://image.tmdb.org/t/p/original/${
                  tv?.poster_path || tv?.backdrop_path
                }`}
                alt={`${tv?.name || tv?.title}'s Poster`}
                width={200}
                height={200}
                quality={100}
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            ) : (
              <Image
                src="/empty-img.jpg"
                alt="Drama image"
                width={200}
                height={200}
                quality={100}
                className="w-[60px] h-[90px] bg-center object-center rounded-md"
              />
            )}
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv_id}`}
                className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-0 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start px-2">
          <div className="w-full h-full md:w-[66.66667%] px-3">
            <div className=" bg-white dark:bg-[#242424] border rounded-md ">
              <div className="w-full bg-sky-300 dark:bg-[#242424] border-b boder-b-bg-slate-200 dark:border-b-[#272727] rounded-md p-5">
                <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                  {tv?.name}
                </h1>
              </div>
              <div className="px-4 py-3">
                <div className="block">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      name="most_helpful"
                      className="relative text-sm bg-white dark:bg-[#3a3b3c] border border-[#dcdfe6] dark:border-[#3e4042] rounded px-5 py-3"
                      onClick={() => handleDropdownToggle("review_type")}
                    >
                      {reviewType}
                      <span className="inline-block align-middle">
                        <IoIosArrowDown />
                      </span>
                    </button>
                    {openDropdown === "review_type" && (
                      <AnimatePresence>
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{ height: "90px" }}
                          className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10"
                        >
                          <li
                            className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                              reviewType === "Most Helpful"
                                ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                : "text-black dark:text-white"
                            }`}
                            onClick={() => {
                              handleDropdownToggle("review_type");
                              setReviewType("Most Helpful");
                            }}
                          >
                            {reviewType}
                          </li>
                          <li
                            className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                              reviewType === "Most Recent"
                                ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                : "text-black dark:text-white"
                            }`}
                            onClick={() => {
                              handleDropdownToggle("review_type");
                              setReviewType("Most Recent");
                            }}
                          >
                            {reviewType}
                          </li>
                        </motion.ul>
                      </AnimatePresence>
                    )}
                  </div>
                  <div className="relative inline-block">
                    <button
                      type="button"
                      name="most_helpful"
                      className="relative text-sm bg-white dark:bg-[#3a3b3c] px-5 py-3"
                      onClick={() => handleDropdownToggle("language")}
                    >
                      All Languages
                      <span className="inline-block align-middle">
                        <IoIosArrowDown />
                      </span>
                    </button>
                    {openDropdown === "language" && (
                      <AnimatePresence>
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{ width: "400px", height: "auto" }}
                          className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10"
                        >
                          <li className="w-[50%] relative float-left flex flex-col">
                            <label
                              htmlFor="language"
                              className="font-semibold px-5 py-3"
                            >
                              Languages
                            </label>
                            {reviewLanguage?.map((lang, idx) => {
                              return (
                                <div key={idx} className="px-5 py-1">
                                  <label
                                    className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                                      languages === lang?.value
                                        ? "text-[#409eff] font-bold"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="languages"
                                      className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                                      checked={lang?.value === languages}
                                      onClick={() => setLanguages(lang?.value)}
                                    />
                                    <span className="px-1">{lang?.value}</span>
                                  </label>
                                </div>
                              );
                            })}
                          </li>

                          <li className="w-[50%] relative float-left flex flex-col">
                            <label
                              htmlFor="status"
                              className="font-semibold px-5 py-3"
                            >
                              Filter by Status
                            </label>
                            {reviewStatus?.map((stat, idx) => {
                              return (
                                <div key={idx} className="px-5 py-1">
                                  <label
                                    className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                                      status === stat?.value
                                        ? "text-[#409eff] font-bold"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="status"
                                      className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                                      checked={stat?.value === status}
                                      onClick={() => setStatus(stat?.value)}
                                    />
                                    <span className="px-1">{stat?.label}</span>
                                  </label>
                                </div>
                              );
                            })}
                          </li>
                        </motion.ul>
                      </AnimatePresence>
                    )}
                  </div>

                  <Link
                    href={`/tv/${tv_id}/write_reviews`}
                    className="float-right text-white bg-[#409eff] border border-[#409eff] rounded-md px-4 py-2"
                  >
                    Write Review
                  </Link>
                </div>
              </div>
              {currentItems?.map((review: ITvReview, idx: number) => {
                const isCurrentUserReviewd = review?.reviewBy?.some((data) =>
                  currentUser?.id?.includes(data?.userId)
                );
                const isCurrentUserReviewdAction = review?.reviewBy?.find(
                  (data) => currentUser?.id?.includes(data?.userId)
                );
                const isLongReview = review?.review?.length > 500;
                return (
                  <div id={review?.id} className="flex flex-col" key={idx}>
                    <div className="flex justify-between bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
                      <div className="flex items-center">
                        <Image
                          src={`${
                            review?.userInfo?.profileAvatar ||
                            review?.userInfo?.image
                          }`}
                          alt={`${
                            review?.userInfo?.displayName ||
                            review?.userInfo?.name
                          }`}
                          width={100}
                          height={100}
                          className="size-[50px] object-cover rounded-full"
                        />

                        <div className="flex flex-col text-black pl-2">
                          <Link
                            href={`/person/${review?.userId}`}
                            className="text-[#2490da] text-sm md:text-md"
                          >
                            {review?.userInfo?.displayName ||
                              review?.userInfo?.name}
                          </Link>

                          <p className="text-black dark:text-white text-sm font-semibold">
                            {review?.reviewHelpful} people found this review
                            helpful
                          </p>
                          <Link
                            href=""
                            className="text-[#2490da] text-sm md:text-md"
                          >
                            Other reviews by this user
                          </Link>
                        </div>
                      </div>
                      <div className="">
                        <p className="text-xs text-right text-[#999] pb-1">
                          {formatDate(review?.updatedAt)}
                        </p>
                        {review?.finishedWatching === false ? (
                          <p className="text-xs text-right text-[#818a91] pb-1">
                            {review?.episode} of {tv?.number_of_episodes}{" "}
                            episodes seen
                          </p>
                        ) : (
                          <p className="text-xs text-right text-[#818a91] pb-1">
                            {review?.episode} of {tv?.number_of_episodes}{" "}
                            episodes seen
                          </p>
                        )}
                        <div className="flex items-center text-end justify-end">
                          {review?.finishedWatching === false ? (
                            <p className="text-xs text-[#3a8ee6] border border-[#3a8ee6] rounded-md px-2 mr-2">
                              Ongoing
                            </p>
                          ) : (
                            <p className="text-xs text-[#5cb85c] border border-[#5cb85c] rounded-md px-2 mr-2">
                              Completed
                            </p>
                          )}
                          <IoLogoWechat />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2.5">
                      <div className="-mx-3">
                        <div className="relative float-left w-full overflow-hidden break-words">
                          <div className="relative float-right border border-[#00000024] rounded-sm m-2">
                            <div className="bg-[#e9f4fb] dark:bg-[#1b1c1d] text-[#1675b6] border-b border-b-[#06090c21] dark:border-b-[#3e4042] px-4 py-1">
                              <b className="font-normal">Overall</b>{" "}
                              <span className="float-right text-[#1675b6]">
                                {review?.overall_score}
                              </span>
                            </div>
                            <div className="text-sm bg-white dark:bg-[#1b1c1d] py-2 px-4">
                              <div>
                                Story{" "}
                                <span className="float-right pl-4">
                                  {review?.rating_score?.story}
                                </span>
                              </div>
                              <div>
                                Acting/Cast{" "}
                                <span className="float-right pl-4">
                                  {review?.rating_score?.acting}
                                </span>
                              </div>
                              <div>
                                Music{" "}
                                <span className="float-right pl-4">
                                  {review?.rating_score?.music}
                                </span>
                              </div>{" "}
                              <div>
                                Rewatch Value{" "}
                                <span className="float-right pl-4">
                                  {review?.rating_score?.rewatchValue}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review?.spoiler === true && (
                            <p className="text-sm text-[#cc3737] font-bold px-3 py-1">
                              This review may contain spoilers
                            </p>
                          )}
                          <p className="text-sm font-bold p-3">
                            {review?.headline}
                          </p>
                          <p className="review-content text-[#333] dark:text-white text-sm px-3">
                            {review?.review?.length > 500 &&
                            !expandedReviews?.has(idx)
                              ? `${review?.review.slice(0, 500)}...`
                              : review?.review}
                            {review?.review?.length > 500 && (
                              <button
                                onClick={() => toggleExpand(idx)}
                                className="text-md font-semibold text-[#0275d8]"
                              >
                                {expandedReviews?.has(idx)
                                  ? "Show Less"
                                  : "Read More"}
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
                                onClick={() =>
                                  submitReviewHelpful("Yes", review?.id)
                                }
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
                                onClick={() =>
                                  submitReviewHelpful("No", review?.id)
                                }
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
                                    isCurrentUserReviewdAction?.action ===
                                      "Cancel"
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    submitReviewHelpful("Cancel", review?.id)
                                  }
                                  disabled={
                                    loadingStates[`${review.id}-Cancel`] ||
                                    isCurrentUserReviewdAction?.action ===
                                      "Cancel"
                                      ? true
                                      : false
                                  }
                                >
                                  {loadingStates[`${review.id}-Cancel`] ? (
                                    <ClipLoader
                                      color="#c0c4cc"
                                      loading={
                                        loadingStates[`${review.id}-Cancel`]
                                      }
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
              <div className="py-5">
                <SearchPagination
                  setPage={setPage}
                  totalItems={totalItems}
                  per_page={per_page as string}
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full md:w-[33.33333%] px-3">
            <div className="flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:p-4 border rounded-md bg-white p-2 dark:bg-[#242424]">
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  tv?.poster_path || tv?.backdrop_path
                }`}
                alt="image"
                width={500}
                height={300}
                className="block align-middle w-[350px] h-[480px]"
              />
              <div className="mt-2 flex items-center justify-between">
                <ShareButton
                  tv={`https://image.tmdb.org/t/p/original/${
                    tv?.poster_path || tv?.backdrop_path
                  }`}
                />
              </div>
            </div>
            <div className="mt-5">
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
      </div>
    </div>
  );
};

export default Reviews;
