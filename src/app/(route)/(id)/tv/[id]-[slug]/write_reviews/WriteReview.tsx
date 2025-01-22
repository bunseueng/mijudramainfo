"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { currentUserProps } from "@/helper/type";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoIosArrowDown,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";
import { reviewLanguage } from "@/helper/item-list";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Image from "next/image";

type RatingCategory = "story" | "acting" | "music" | "rewatchValue" | "overall";

interface WriteReview {
  tv_id: string;
  currentUser: currentUserProps | null;
}

const WriteReview: React.FC<WriteReview> = ({ tv_id, currentUser }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const [ratings, setRatings] = useState<{
    story: number;
    acting: number;
    music: number;
    rewatchValue: number;
    overall: number;
  }>({
    story: 0,
    acting: 0,
    music: 0,
    rewatchValue: 0,
    overall: 0,
  });

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [containsSpoilers, setContainsSpoilers] = useState<boolean | null>(
    null
  );
  const [finishedWatching, setFinishedWatching] = useState<boolean | null>(
    null
  );
  const [epCounter, setEpCounter] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState(tv?.number_of_episodes);
  const [isEpCounterClicked, setIsEpCounterClicked] = useState<boolean>(false);
  const [dropping, setDropping] = useState<boolean | null>(null);
  const [headline, setHeadline] = useState("");
  const [review, setReview] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<RatingCategory | null>(
    null
  );
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();

  const handleRatingChange = (
    category: RatingCategory,
    newRating: number | null
  ) => {
    if (newRating !== null) {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [category]: newRating,
      }));
    }
  };
  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.error || "Failed to get color");
    }

    return data.averageColor;
  };
  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const color = await getColorFromImage(
        `https://image.tmdb.org/t/p/${tv?.backdrop_path ? "w300" : "w92"}/${
          tv?.backdrop_path || tv?.poster_path
        }`
      );
      setDominantColor(color);
    }
  }, [tv?.backdrop_path, tv?.poster_path]);

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === `${dropdown}` ? null : `${dropdown}`));
  };

  const setLanguages = (language: string) => {
    setLanguage(language);
  };

  const handleEpIncrement = () => {
    setEpCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      setCurrentEpisode(newCounter);
      return newCounter;
    });
    setIsEpCounterClicked(true);
  };

  const handleEpDecrement = () => {
    if (epCounter > 1) {
      setEpCounter((prevCounter) => {
        const newCounter = prevCounter - 1;
        setCurrentEpisode(newCounter);
        return newCounter;
      });
      setIsEpCounterClicked(true);
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current;
      imgElement.addEventListener("load", extractColor);

      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [extractColor]);

  // Convert the 1-10 rating scale to a 0-5 star scale with increments of 0.5
  const convertToStarValue = (rating: number) => {
    return rating / 2; // 1-10 scale to 0-5 scale
  };

  // Convert the 0-5 star scale back to 1-10 rating scale
  const convertToRatingValue = (starValue: number) => {
    return Math.round(starValue * 2 * 2) / 2; // 0-5 scale to 1-10 scale with increments of 0.5
  };

  const calculateTotalScore = () => {
    const { story, acting, music, rewatchValue, overall } = ratings;
    const total = (story + acting + music + rewatchValue + overall) / 5;
    const roundedTotal = Math.round(total * 2) / 2; // Round to the nearest 0.5
    return roundedTotal.toFixed(1); // Keep one decimal place
  };

  const onSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/tv/${tv_id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv_id.toString(),
          rating_score: {
            story: convertToRatingValue(ratings.story) / 2,
            acting: convertToRatingValue(ratings.acting) / 2,
            music: convertToRatingValue(ratings.music) / 2,
            rewatchValue: convertToRatingValue(ratings.rewatchValue) / 2,
            overall: convertToRatingValue(ratings.overall) / 2,
          },
          userInfo: {
            name: currentUser?.name,
            displayName: currentUser?.displayName,
            image: currentUser?.image,
            profileAvatar: currentUser?.profileAvatar,
          },
          spoiler: containsSpoilers,
          finishedWatching,
          dropping: dropping,
          episode: currentEpisode || tv?.number_of_episodes,
          review_language: language,
          headline,
          review,
          overall_score: calculateTotalScore(),
        }),
      });

      if (res?.status === 200) {
        toast.success("Review Submitted Successfully");
        router.refresh();
      } else if (res?.status === 400) {
        toast.error("Invalid User");
      } else if (res?.status === 404) {
        toast.error("All Field is Required");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <div
        className="bg-cyan-600"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center lg:items-start">
            <Image
              ref={imgRef}
              src={`https://image.tmdb.org/t/p/original/${
                tv?.poster_path || tv?.backdrops_path
              }`}
              alt={`${tv?.name || tv?.title}'s Poster`}
              width={200}
              height={200}
              quality={100}
              priority
              className="w-[80px] h-[90px] bg-center bg-cover object-cover rounded-md"
            />
            <div className="flex flex-col pl-5 py-3">
              <h1 className="text-white text-2xl font-bold">
                {tv?.title || tv?.name}
              </h1>
              <h3 className="text-white text-2xl font-bold">
                ({getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[100%] bg-white dark:bg-[#242526] border-2 border-slate-200 dark:border-[#232426] shadow-sm rounded-b-md">
        <div className="block">
          <div className="relative float-left w-full md:w-[50%] p-2 md:p-5">
            <div className="px-3 mb-2">
              <h1 className="text-md font-semibold pt-3 mb-2">
                Step 1: Read Guidelines
              </h1>
              <ul className="list-item pl-8 mb-5">
                <li className="list-disc text-sm font-semibold py-5">
                  Write your own reviews.
                </li>

                <li className="list-disc text-sm font-semibold pb-5">
                  Avoid including story summaries.
                </li>

                <li className="list-disc text-sm font-semibold pb-5">
                  Share why you liked or disliked the movie.
                </li>

                <li className="list-disc text-sm font-semibold pb-5">
                  Do not post major spoilers.
                </li>

                <li className="list-disc text-sm font-semibold pb-5">
                  Do not add spoilers to the headline.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="relative float-left w-full md:w-[50%] border-l-[1px] border-l-[#78828c21] p-2 md:p-5">
            <div className="px-3 mb-2">
              <h1 className="text-md font-semibold pt-3 mb-2">
                Step 2: Ratings
              </h1>
              <div className="rating-container">
                {["story", "acting", "music", "rewatchValue", "overall"].map(
                  (category, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                      onMouseEnter={() =>
                        setHoveredCategory(category as RatingCategory)
                      }
                      onMouseLeave={() => {
                        setHoveredCategory(null);
                        setHoveredRating(null);
                      }}
                    >
                      <div className="category pl-2 capitalize font-bold mr-2">
                        {category.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="flex items-center w-[50%]">
                        <Rating
                          name={`${category}-rating`}
                          value={convertToStarValue(
                            ratings[category as RatingCategory]
                          )} // Convert 1-10 scale to 0-5 stars
                          max={5} // Display 5 stars
                          precision={0.25} // Allow increments of 0.5
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              // Convert 0-5 star rating to 1-10 scale
                              const newRating = convertToRatingValue(newValue);
                              handleRatingChange(
                                category as RatingCategory,
                                newRating
                              );
                            }
                          }}
                          onChangeActive={(event, newHoverValue) => {
                            if (
                              newHoverValue !== null &&
                              newHoverValue !== -1
                            ) {
                              // Convert hovered 0-5 star rating to 1-10 scale
                              const newHoverRating =
                                convertToRatingValue(newHoverValue);
                              setHoveredRating(newHoverRating);
                            } else {
                              setHoveredRating(null);
                            }
                          }}
                          icon={
                            <StarRoundedIcon
                              style={{
                                fontSize: 40,
                                transition: "transform 0.3s ease-in-out",
                              }}
                              className="hover:scale-110"
                            />
                          }
                          emptyIcon={
                            <StarBorderRoundedIcon
                              style={{
                                fontSize: 40,
                                transition: "transform 0.3s ease-in-out",
                              }}
                              className="hover:scale-110 dark:text-white"
                            />
                          }
                        />

                        <div
                          className="pl-2 transition-transform duration-300 ease-in-out"
                          style={{
                            transform:
                              hoveredCategory === category
                                ? "scale(1.1)"
                                : "scale(1)",
                            opacity: hoveredCategory === category ? 1 : 0.8,
                          }}
                        >
                          {hoveredCategory === category &&
                          hoveredRating !== null ? (
                            <span className="font-bold">
                              {Number.isInteger(hoveredRating)
                                ? hoveredRating
                                : hoveredRating.toFixed(1)}
                              <span className="font-normal">/10</span>
                            </span>
                          ) : (
                            <span className="font-bold">
                              {Number.isInteger(
                                ratings[category as RatingCategory]
                              )
                                ? ratings[category as RatingCategory]
                                : ratings[category as RatingCategory].toFixed(
                                    1
                                  )}
                              <span className="font-normal">/10</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Box>
                  )
                )}
                <p className="text-[#818a91] text-sm pl-2">
                  Suggested overall score: {calculateTotalScore()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="block float-left w-full p-2 md:p-5">
          <div className="px-3 mb-2">
            <h1 className="text-md font-semibold pt-3 mb-2">
              Step 3: Write Your Review
            </h1>
            <div className="relative float-left w-full text-left mb-4 my-5">
              <div className="-mx-3">
                <div className="relative float-left w-[25%] px-3">
                  <label className="block text-sm text-gray-700 dark:text-white mb-2">
                    Does this review contain spoilers?
                  </label>
                </div>
                <div className="relative float-left w-[75%] px-3">
                  <label
                    className={`mr-4 text-sm transform duration-300 cursor-pointer ${
                      containsSpoilers === true
                        ? "text-[#409eff] font-bold"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="spoilers"
                      value="yes"
                      checked={containsSpoilers === true}
                      onChange={() => setContainsSpoilers(true)}
                      className="transform duration-300 cursor-pointer mr-1 px-2"
                    />
                    <span className="pl-1">Yes</span>
                  </label>

                  <label
                    className={`text-sm transform duration-300 cursor-pointer ${
                      containsSpoilers === false
                        ? "text-[#409eff] font-bold"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="spoilers"
                      value="no"
                      checked={containsSpoilers === false}
                      onChange={() => setContainsSpoilers(false)}
                      className="transform duration-300 cursor-pointer mr-1 px-2"
                    />
                    <span className="pl-1">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="relative float-left w-full text-left mb-4">
              <div className="-mx-3">
                <div className="relative float-left w-[25%] px-3">
                  <label className="block text-sm text-gray-700 dark:text-white mb-2">
                    Have you finished watching this title?
                  </label>
                </div>
                <div className="relative float-left w-[75%] px-3">
                  <label
                    className={`mr-4 text-sm transform duration-300 cursor-pointer ${
                      finishedWatching === true
                        ? "text-[#409eff] font-bold"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="finished"
                      value="yes"
                      checked={finishedWatching === true}
                      onChange={() => setFinishedWatching(true)}
                      className="transform duration-300 cursor-pointer mr-1 px-2"
                    />
                    <span className="pl-1">Yes</span>
                  </label>
                  <label
                    className={`text-sm transform duration-300 cursor-pointer ${
                      finishedWatching === false
                        ? "text-[#409eff] font-bold"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="finished"
                      value="no"
                      checked={finishedWatching === false}
                      onChange={() => setFinishedWatching(false)}
                      className="transform duration-300 cursor-pointer mr-1 px-2"
                    />
                    <span className="pl-1">No</span>
                  </label>
                </div>
              </div>
              {finishedWatching === false && (
                <div className="w-full float-left relative px-3 my-3">
                  <div className="w-full relative float-left bg-[#f7fbff] dark:bg-[#191a1b] rounded-md p-4 -mx-3 my-3">
                    <div className="relative float-left w-full text-left mb-4">
                      <div className="-mx-3">
                        <div className="relative float-left w-[25%] px-3">
                          <label className="block text-[13px] text-gray-700 dark:text-white mb-2">
                            Are you dropping this title?
                          </label>
                        </div>
                        <div className="relative float-left w-[75%] px-3">
                          <label
                            className={`mr-4 text-sm transform duration-300 cursor-pointer ${
                              dropping === true
                                ? "text-[#409eff] font-bold"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="dropping"
                              value="yes"
                              checked={dropping === true}
                              onChange={() => setDropping(true)}
                              className="transform duration-300 cursor-pointer mr-1 px-2"
                            />
                            <span className="pl-1">Yes</span>
                          </label>
                          <label
                            className={`text-sm transform duration-300 cursor-pointer ${
                              dropping === false
                                ? "text-[#409eff] font-bold"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="dropping"
                              value="no"
                              checked={dropping === false}
                              onChange={() => setDropping(false)}
                              className="transform duration-300 cursor-pointer mr-1 px-2"
                            />
                            <span className="pl-1">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="relative float-left w-full text-left mb-4">
                      <div className="-mx-3">
                        <div className="relative float-left w-[25%] px-3">
                          <label className="block text-[13px] text-gray-700 dark:text-white mb-2">
                            Have you finished watching this title?
                          </label>
                        </div>
                        <div className="relative float-left w-[75%] px-3">
                          <div className="inline-block relative mt-1">
                            <input
                              name="details.episode"
                              type="number"
                              placeholder="e.g. 12"
                              className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#dcdfe6] rounded-md outline-none py-2 px-4"
                              value={
                                currentEpisode
                                  ? currentEpisode
                                  : isEpCounterClicked
                                  ? epCounter
                                  : tv?.number_of_episodes
                              }
                              onChange={(e) =>
                                setCurrentEpisode(Number(e.target.value))
                              }
                            />
                            <div className="absolute right-0 top-0">
                              <button
                                type="button"
                                className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b border-b-[#dcdfe6] dark:border-b-[#46494a] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] border-t dark:border-t-0 border-t-[#dcdfe6] dark:border-t-[#46494a] border-r dark:border-r-0 border-r-[#dcdfe6] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                                  currentEpisode === tv?.number_of_episodes
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                onClick={handleEpIncrement}
                                disabled={
                                  currentEpisode === tv?.number_of_episodes
                                    ? true
                                    : false
                                }
                              >
                                <IoMdArrowDropup className="" />
                              </button>

                              <button
                                type="button"
                                className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
                                onClick={handleEpDecrement}
                              >
                                <IoMdArrowDropdown />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative float-left w-full text-left mb-4">
              <div className="-mx-3">
                <div className="relative float-left w-[25%] px-3">
                  <label
                    htmlFor="language"
                    className="block text-sm text-gray-700 dark:text-white mb-2"
                  >
                    Review Language
                  </label>
                </div>

                <div className="relative float-left w-[75%] mb-3 px-3">
                  <div className="relative">
                    <input
                      type="text"
                      name="review.language"
                      readOnly
                      autoComplete="off"
                      className="text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white placeholder:text-sm bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#c0c4cc] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
                      placeholder={
                        language
                          ? reviewLanguage?.find((lang) =>
                              lang?.value?.includes(language)
                            )?.label
                          : "Select a review language"
                      }
                      onClick={() => handleDropdownToggle("language")}
                    />
                    <IoIosArrowDown className="text-black dark:text-white absolute bottom-3 left-48" />
                  </div>
                  {openDropdown === `language` && (
                    <AnimatePresence>
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-[210px] h-[250px] absolute bg-white dark:bg-[#242424] border-2 border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                        style={{ height: "160px" }}
                      >
                        {reviewLanguage?.map((items, index) => {
                          const scrollIntoViewIfNeeded = (element: any) => {
                            const rect = element?.getBoundingClientRect();
                            const isVisible =
                              rect?.top >= 0 &&
                              rect?.left >= 0 &&
                              rect?.bottom <=
                                (window?.innerHeight ||
                                  document?.documentElement?.clientHeight) &&
                              rect?.right <=
                                (window?.innerWidth ||
                                  document?.documentElement.clientWidth);

                            if (!isVisible) {
                              element?.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "nearest",
                              });
                            }
                          };
                          const isContentRating = language === items?.value;
                          return (
                            <li
                              ref={(el) => {
                                if (isContentRating && el) {
                                  scrollIntoViewIfNeeded(el);
                                }
                              }}
                              className={`text-sm text-black dark:text-white hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                isContentRating
                                  ? "text-[#409eff] bg-[#00000011] dark:bg-[#2a2b2c]"
                                  : ""
                              } `}
                              onClick={() => {
                                handleDropdownToggle("language");
                                setLanguages(items?.value); // Update the story for this item
                              }}
                              key={index}
                            >
                              {items?.label}
                            </li>
                          );
                        })}
                      </motion.ul>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>

            <div className="relative float-left w-full text-left mb-4">
              <div className="-mx-3">
                <div className="relative float-left w-[25%] px-3">
                  <label
                    className="block text-sm text-gray-700 dark:text-white mb-2"
                    htmlFor="headline"
                  >
                    Add a headline
                  </label>
                </div>
                <div className="relative float-left w-[75%] px-3">
                  <input
                    type="text"
                    id="headline"
                    className="w-full text-sm dark:bg-[#3a3b3c] border border-[#dcdfe6] dark:border-[#54585a] rounded outline-none focus:border-[#409eff] px-3 py-2"
                    placeholder="What's most important to know?"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="relative float-left w-full text-left mb-4">
              <div className="-mx-3">
                <div className="relative float-left w-[25%] px-3">
                  <label
                    className="block text-sm text-gray-700 dark:text-white mb-2"
                    htmlFor="review"
                  >
                    Write Your Review
                  </label>
                </div>
                <div className="relative float-left w-[75%] px-3">
                  <textarea
                    id="review"
                    className="w-full min-h-[222px] h-[222px] text-sm dark:bg-[#3a3b3c] border border-[#dcdfe6] dark:border-[#54585a] rounded outline-none focus:border-[#409eff] px-3 py-2"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            name="Submit Review"
            className="text-sm bg-[#ecf5ff] dark:bg-[#202020] border-[1px] border-[#b3d8ff] dark:border-[#b3d8ff] text-[#409eff] dark:hover:bg-[#409effcc] dark:hover:border-[#409effcc] dark:hover:text-white transform duration-300 rounded px-4 py-2"
            onClick={onSubmit}
          >
            <span className="flex items-center mr-1">
              <ClipLoader color="#c0c4cc" loading={submitLoading} size={19} />
              <span className={`${submitLoading && "pl-1 pt-1"}`}>
                Submit Review
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
