"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { ITvReview, SearchParamsType } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import ColorThief from "colorthief";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { reviewLanguage, reviewStatus } from "@/helper/item-list";
import ClipLoader from "react-spinners/ClipLoader";
import { IoLogoWechat } from "react-icons/io5";
import { formatDate } from "@/app/actions/formatDate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";
import { ReviewType } from "@/app/(route)/(id)/tv/[id]/reviews/Reviews";
import dynamic from "next/dynamic";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const ProfileReviews: React.FC<ReviewType> = ({
  getDrama,
  getReview,
  currentUser,
}) => {
  // Step 1: Extract all tv_id values from getReview, filtering out any falsy values (null, undefined, etc.)
  const tv_ids = getReview?.map((review) => review?.tv_id).filter(Boolean);

  // Step 2: Create a function to fetch all TV shows individually
  const fetchMultipleTvShows = async (tv_ids: string[]) => {
    // Fetch each TV show in parallel
    const results = await Promise.all(tv_ids.map((id: string) => fetchTv(id))); // fetchTv is called separately for each id
    return results; // Returns an array of TV show data
  };

  // Step 3: Use the useQuery hook to fetch data with the fetchMultipleTvShows function
  const { data: tv, isLoading } = useQuery({
    queryKey: ["drama", tv_ids], // Query key includes the array of tv_ids to keep the query unique
    queryFn: () => fetchMultipleTvShows(tv_ids), // Function to fetch all TV shows
  });
  console.log(tv);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>("");
  const [reviewType, setReviewType] = useState<string>("Most Helpful");
  const [languages, setLanguages] = useState<string>();
  const [status, setStatus] = useState<string>("all_status");
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const pathname = usePathname();
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const per_page = Number(searchParams?.get("per_page")) || "10"; // Default to 10 items per page
  const initialPage = Number(searchParams?.get("page")) || 1; // Initial page from URL or default to 1
  const [page, setPage] = useState(initialPage);
  const start = (page - 1) * Number(per_page);
  const end = start + Number(per_page);
  const sortby = searchParams?.get("sortby") ?? "";
  const lang = searchParams?.get("xlang") ?? "";
  const statusQ = searchParams?.get("status") ?? "";
  const sortedItems = useMemo(() => {
    setLoading(true);
    let sortedReviews = [...getReview];
    // Sorting by most recent
    if (sortby === "most_recent") {
      sortedReviews?.sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      );
    }
    // Sorting by most helpful
    else if (sortby === "most_helpful") {
      sortedReviews?.sort((a, b) => b?.reviewHelpful - a?.reviewHelpful);
    }
    // Filtering by status
    if (statusQ === status) {
      sortedReviews = sortedReviews.filter((stat) => {
        if (status === "completed") return stat?.finishedWatching === true;
        if (status === "ongoing")
          return stat?.finishedWatching === false && stat?.dropping !== true;
        if (status === "dropped") return stat?.dropping === true;
        if (status === "spoiler") return stat?.spoiler !== true;
        return true;
      });
    }
    // Filtering by language
    if (lang === languages) {
      sortedReviews = sortedReviews.filter(
        (review) => review?.review_language === languages
      );
    } else {
      // Default language filter
      sortedReviews = sortedReviews.filter((review) => review?.review_language);
    }
    setLoading(false);
    return sortedReviews;
  }, [sortby, getReview, lang, languages, status, statusQ]);

  const totalItems = sortedItems?.length;
  const currentItems = sortedItems?.slice(start, end) as ITvReview[];

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

  const selectBox = (key: string, value: string) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    values = [value];

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }
    // Set the specific query parameter to the selected value
    query[key] = value;
    // If the value is empty, remove the key from the query parameters
    if (!value) {
      delete query[key];
    }

    const queryString = new URLSearchParams(query).toString();

    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
  };

  const submitReviewHelpful = async (
    feedback: string,
    reviewId: string,
    tv_id: string
  ) => {
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

  if (loading) {
    return <SearchLoading />;
  }
  if (isLoading) {
    return <SearchLoading />;
  }

  if (!tv) {
    return <SearchLoading />; // Add loading state if data is being fetched
  }

  return (
    <div className="bg-slate-100 dark:bg-[#1e1e1e]">
      <div className="w-full relative overflow-hidden">
        <div className="w-full h-full">
          <div className="bg-white dark:bg-[#242424]">
            <div className="block bg-white dark:bg-[#242526] px-2 py-4">
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
                          selectBox("sortby", "most_helpful");
                        }}
                      >
                        Most Helpful
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
                          selectBox("sortby", "most_recent");
                        }}
                      >
                        Most Recent
                      </li>
                    </motion.ul>
                  </AnimatePresence>
                )}
              </div>
              <div className="relative inline-block">
                <button
                  type="button"
                  name="most_helpful"
                  className="relative text-sm px-5 py-3"
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
                        <div className="px-5 py-1">
                          <label
                            className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                              "all_language" === languages
                                ? "text-[#409eff] font-bold"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="languages"
                              className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                              checked={"all_language" as any}
                              onClick={() => {
                                setLanguages("");
                                selectBox("xlang", "all_language");
                              }}
                            />
                            <span className="px-1">All Languages</span>
                          </label>
                        </div>
                        {reviewLanguage
                          ?.filter((langDB) =>
                            getReview?.some((item) =>
                              item?.review_language
                                ?.split(",")
                                .map((lang) => lang.trim().toLowerCase())
                                .includes(langDB?.value.trim().toLowerCase())
                            )
                          )
                          ?.map((lang, idx) => {
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
                                    onClick={() => {
                                      setLanguages(lang?.value);
                                      selectBox("xlang", lang?.value);
                                    }}
                                    defaultValue="en"
                                  />
                                  <span className="px-1">
                                    {lang?.label} (
                                    {
                                      getReview?.filter((review) =>
                                        review?.review_language?.includes(
                                          lang?.value
                                        )
                                      )?.length
                                    }
                                    )
                                  </span>
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
                                  onClick={() => {
                                    setStatus(stat?.value);
                                    selectBox("status", stat?.value);
                                  }}
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
            </div>
            {currentItems?.length > 0 ? (
              currentItems?.map((review: ITvReview, idx: number) => {
                const isCurrentUserReviewd = review?.reviewBy?.some((data) =>
                  currentUser?.id?.includes(data?.userId)
                );
                const isCurrentUserReviewdAction = review?.reviewBy?.find(
                  (data) => currentUser?.id?.includes(data?.userId)
                );
                const isLongReview = review?.review?.length > 500;
                const findDrama = tv?.find((drama) =>
                  review?.tv_id?.includes(drama?.id)
                );
                return (
                  <div id={review?.id} className="flex flex-col" key={idx}>
                    <div className=" bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
                      <div className="flex justify-between">
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
                            priority
                          />

                          <div className="flex flex-col text-black pl-2">
                            <Link
                              href={`/tv/${findDrama?.id}`}
                              className="text-black dark:text-white text-sm md:text-md mb-1"
                            >
                              Reviewed{" "}
                              <span className="text-[#2490da] cursor-pointer">
                                {findDrama?.name || findDrama?.title}
                              </span>
                            </Link>
                            <Link
                              href=""
                              className="text-black dark:text-white text-sm md:text-md"
                            >
                              By{" "}
                              <span className="text-[#2490da] cursor-pointer">
                                {review?.userInfo?.displayName ||
                                  review?.userInfo?.name}
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className="block">
                          <label
                            htmlFor="review_date"
                            className="text-sm font-semibold"
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
                          <div className="flex items-start justify-center border-b border-b-slate-400  border-t border-t-slate-400 py-1">
                            <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                              <label
                                htmlFor="story"
                                className="text-sm font-bold"
                              >
                                Story
                              </label>
                              <p>{review?.rating_score?.story}</p>
                            </div>
                            <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                              <label
                                htmlFor="acting_cast"
                                className="text-sm font-bold"
                              >
                                Acting/Cast
                              </label>
                              <p>{review?.rating_score?.acting}</p>
                            </div>
                            <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                              <label
                                htmlFor="music"
                                className="text-sm font-bold"
                              >
                                Music
                              </label>
                              <p>{review?.rating_score?.music}</p>
                            </div>
                            <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                              <label
                                htmlFor="rewatch_value"
                                className="text-sm font-bold"
                              >
                                Rewatch Value
                              </label>
                              <p>{review?.rating_score?.rewatchValue}</p>
                            </div>
                            <div className="flex flex-col items-center border-r border-r-slate-400 px-5">
                              <label
                                htmlFor="overall"
                                className="text-sm font-bold"
                              >
                                Overall
                              </label>
                              <p>{review?.overall_score}</p>
                            </div>

                            <div className="flex flex-col items-center px-5">
                              {" "}
                              {review?.finishedWatching === false ? (
                                <p className="text-xs text-right text-[#818a91] pb-1">
                                  {review?.episode} of{" "}
                                  {findDrama?.number_of_episodes} episodes seen
                                </p>
                              ) : (
                                <p className="text-xs text-right text-[#818a91] pb-1">
                                  {review?.episode} of{" "}
                                  {findDrama?.number_of_episodes} episodes seen
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
                            <p className="text-black dark:text-white text-sm font-semibold">
                              {review?.reviewHelpful} people found this review
                              helpful
                            </p>
                            {review?.spoiler === true && (
                              <p className="text-sm text-[#cc3737] font-bold pb-1">
                                This review may contain spoilers
                              </p>
                            )}
                          </div>
                          <div className="relative float-right border border-[#00000024] rounded-sm m-2">
                            <Image
                              src={`https://image.tmdb.org/t/p/original/${
                                findDrama.poster_path || findDrama.backdrop_path
                              }`}
                              alt={`${findDrama?.name || findDrama?.title}`}
                              width={100}
                              height={100}
                              className="w-[100px] h-[150px] object-cover rounded-md"
                              priority
                            />
                          </div>

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
                                className="text-md font-semibold text-[#0275d8] pl-1"
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
                                  submitReviewHelpful(
                                    "Yes",
                                    review?.id,
                                    findDrama?.id
                                  )
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
                                  submitReviewHelpful(
                                    "No",
                                    review?.id,
                                    findDrama?.id
                                  )
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
                                    submitReviewHelpful(
                                      "Cancel",
                                      review?.id,
                                      findDrama?.id
                                    )
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
              })
            ) : (
              <div className="px-4 py-2">
                There is no Review for this user yet!
              </div>
            )}
            <div className="border-b border-b-[#78828c21]"></div>
            <div className="py-5">
              <SearchPagination
                setPage={setPage}
                totalItems={totalItems as number}
                per_page={per_page as string}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReviews;
