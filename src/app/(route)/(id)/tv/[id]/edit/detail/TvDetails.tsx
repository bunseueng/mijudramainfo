"use client";

import {
  fetchContentRating,
  fetchTitle,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import {
  contentRatingDetail,
  contentTypeDetail,
  countryDetails,
  detailsList,
} from "@/helper/item-list";
import { Drama, DramaDetails, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoIosArrowDown,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import { FaRegTrashAlt } from "react-icons/fa";
import { mergeAndRemoveDuplicates } from "@/app/actions/mergeAndRemove";

const TvDetails: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: content } = useQuery({
    queryKey: ["content"],
    queryFn: () => fetchContentRating(tv_id),
  });
  const { data: title } = useQuery({
    queryKey: ["title"],
    queryFn: () => fetchTitle(tv_id),
  });
  const [detail]: DramaDetails[] = (tvDetails?.details ||
    []) as unknown as DramaDetails[]; // get rid of array without using map or filter

  const [results, setResults] = useState<string[]>([]);
  const [titleResults, setTitleResults] = useState<any[]>([]);
  const [knownAsDetails, setKnownAsDetails] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(1);
  const [epCounter, setEpCounter] = useState<number>(1);
  const [isCounterClicked, setIsCounterClicked] = useState<boolean>(false);
  const [isEpCounterClicked, setIsEpCounterClicked] = useState<boolean>(false);
  const [country, setCountry] = useState<string>(""); // Add state for status
  const [contentType, setContentType] = useState<string>(""); // Add state for status
  const [status, setStatus] = useState<string>(""); // Add state for status
  const [contentRating, setContentRating] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const getContent = content?.results?.map((item: any) => item?.rating);
  const hasNumber12Or13 = getContent?.some((rating: any) => {
    return rating?.includes("12") || rating?.includes("13");
  });
  const hasNumber15 = getContent?.some((rating: any) => {
    return rating?.includes("15");
  });
  const hasNumber18 = getContent?.some((rating: any) => {
    return rating?.includes("18");
  });
  const isRestricted = getContent?.some((rating: any) => {
    return rating?.includes("R");
  });
  const teens13 = hasNumber12Or13 && "13+- Teens 13 or older";
  const teens15 = hasNumber15 && "15+- Teens 15 or older";
  const teens18 = hasNumber18 && "18+ Restricted (violence & profanity)";
  const restricted =
    isRestricted && "R - Restricted Screening (nudity & violence)";
  const isNoRating = getContent?.length === 0 && "Not Yet Rating";
  const NR = getContent?.includes("NR") && "Not Yet Rating";
  const isDrama = tv?.episode_run_time.join("") > 50 ? "TV Show" : "Drama";
  const isEnded = tv?.status === "Ended" && "Finished Airing";
  const isUnconfirmed = tv?.status === "Pilot" && "Unconfirmed";
  const isOngoing = tv?.status === "Returning Series" && "Airing";
  const initialTitle = tv?.title || tv?.name || detail?.title || "";
  const initialNativeTitle = tv?.original_name || detail?.native_title || "";
  const initialSynopsis = tv?.overview || detail?.synopsis || "";
  const initialDuration = detail?.duration || tv?.episode_run_time?.[0] || "";
  const initialEpisode = detail?.episode || tv?.number_of_episodes || "";
  const initialTitleResults = title?.results || "";
  const initialKnownAsDetails = detail?.known_as || "";
  const [currentTitle, setCurrentTitle] = useState(initialTitle);
  const [currentNativeTitle, setCurrentNativeTitle] =
    useState(initialNativeTitle);
  const [currentSynopsis, setCurrentSynopsis] = useState(initialSynopsis);
  const [currentCountry, setCurrentCountry] = useState(country);
  const [currentType, setCurrentType] = useState(contentType);
  const [currentRating, setCurrentRating] = useState(contentRating);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentDuration, setCurrentDuration] = useState(initialDuration);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [currentTitleResults, setCurrentTitleResults] = useState(titleResults);
  const [currentKnownAsDetails, setCurrentKnownAsDetails] =
    useState(knownAsDetails);
  const originalTitle = initialTitle;
  const originalNativeTitle = initialNativeTitle;
  const originalSynopsis = initialSynopsis;
  const originalCountry = detail?.country || tv?.type?.join(" ") || "";
  const originalType = detail?.content_type || isDrama || "";
  const originalRating =
    detail?.content_rating ||
    isNoRating ||
    NR ||
    teens13 ||
    teens15 ||
    teens18 ||
    restricted ||
    "";
  const originalStatus =
    detail?.status || isEnded || isUnconfirmed || (isOngoing as any) || "";
  const originalDuration = initialDuration;
  const originalEpisode = initialEpisode;
  const originalTitleResults = initialTitleResults;
  const originalKnownAsDetails = initialKnownAsDetails;

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const arraysEqual = (arr1: any[] | undefined, arr2: any[] | undefined) => {
    // Handle cases where one or both arrays are undefined
    if (arr1 === undefined && arr2 === undefined) return true;
    if (arr1 === undefined || arr2 === undefined) return false;
    // Handle cases where one or both arrays are empty
    if (arr1.length !== arr2.length) return false;
    // Compare elements of the arrays
    for (let i = 0; i < arr1.length; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
    }
    return true;
  };

  useEffect(() => {
    const hasChanged =
      currentTitle !== originalTitle ||
      currentNativeTitle !== originalNativeTitle ||
      currentSynopsis !== originalSynopsis ||
      currentCountry !== originalCountry ||
      currentType !== originalType ||
      currentRating !== originalRating ||
      currentStatus !== originalStatus ||
      currentDuration !== originalDuration ||
      currentEpisode !== originalEpisode ||
      !arraysEqual(currentTitleResults, originalTitleResults) ||
      !arraysEqual(currentKnownAsDetails, originalKnownAsDetails);
    setIsSubmitEnabled(hasChanged);
  }, [
    currentTitle,
    currentNativeTitle,
    currentSynopsis,
    currentCountry,
    currentType,
    currentRating,
    currentStatus,
    currentDuration,
    currentEpisode,
    currentTitleResults,
    currentKnownAsDetails,
    originalTitle,
    originalNativeTitle,
    originalSynopsis,
    originalCountry,
    originalType,
    originalRating,
    originalStatus,
    originalDuration,
    originalEpisode,
    originalTitleResults,
    originalKnownAsDetails,
  ]);

  useEffect(() => {
    setCurrentTitle(initialTitle);
    setCurrentNativeTitle(initialNativeTitle);
    setCurrentSynopsis(initialSynopsis);
    setCurrentCountry(country);
    setCurrentType(contentType);
    setCurrentRating(contentRating);
    setCurrentStatus(status);
    setCurrentDuration(initialDuration);
    setCurrentEpisode(initialEpisode);
    setCurrentTitleResults(titleResults);
    setCurrentKnownAsDetails(knownAsDetails);
  }, [
    initialTitle,
    initialNativeTitle,
    initialSynopsis,
    country,
    contentType,
    contentRating,
    status,
    initialDuration,
    initialEpisode,
    titleResults,
    knownAsDetails,
  ]);

  useEffect(() => {
    if (detail?.country?.length > 0 ? detail?.country : tv?.type) {
      setCountry(
        detail?.country?.length > 0 ? detail?.country : tv?.type?.join(" ")
      );
    }
    if (detail?.content_type?.length > 0 ? detail?.content_type : isDrama) {
      setContentType(
        detail?.content_type?.length > 0 ? detail?.content_type : isDrama
      );
    }
    if (
      detail?.content_rating?.length > 0
        ? detail?.content_rating
        : isNoRating || NR || teens13 || teens15 || teens18 || restricted
    ) {
      setContentRating(
        detail?.content_rating?.length > 0
          ? detail?.content_rating
          : isNoRating || NR || teens13 || teens15 || teens18 || restricted
      );
    }
    if (
      detail?.status?.length > 0
        ? detail?.status
        : isEnded || isUnconfirmed || (isOngoing as any)
    ) {
      setStatus(
        detail?.status?.length > 0
          ? detail?.status
          : isEnded || isUnconfirmed || (isOngoing as any)
      );
    }
  }, [
    content?.results,
    tv?.type,
    tv?.episode_run_time,
    tv?.status,
    detail?.content_rating,
    detail?.content_type,
    detail?.country,
    detail?.status,
    NR,
    isDrama,
    isEnded,
    isNoRating,
    isOngoing,
    isUnconfirmed,
    restricted,
    teens13,
    teens15,
    teens18,
  ]);
  useEffect(() => {
    if (title?.results) {
      setTitleResults(title.results);
    }
    if (detail?.known_as) {
      setKnownAsDetails(detail.known_as);
    }
  }, [title, detail]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if (e.key === "Enter") {
      e.preventDefault();
      if (value !== "" && !results.includes(value)) {
        setResults((prevResults) => [...prevResults, value]);
      } else if (value !== "" && !titleResults.includes(value)) {
        setTitleResults((prevResults) => [...prevResults, value]);
      } else if (value !== "" && !knownAsDetails.includes(value)) {
        setKnownAsDetails((prevResults) => [...prevResults, value]);
      }
      e.currentTarget.value = "";
    } else if (e.key === "Backspace" && e.currentTarget.value === "") {
      setResults((prevResults) => prevResults.slice(0, -1));
      setTitleResults((prevResults) => prevResults.slice(0, -1));
      setKnownAsDetails((prevResults) => prevResults.slice(0, -1));
    }
  };

  const handleRemoveResult = (index: number) => {
    setResults((prevResults) => prevResults.filter((_, i) => i !== index));
  };

  const handleRemoveTitleResult = (index: number) => {
    setTitleResults((prevResults) => prevResults.filter((_, i) => i !== index));
  };

  const handleRemoveKnownAsDetail = (index: number) => {
    setKnownAsDetails((prevDetails) => {
      const updatedDetails = prevDetails.filter((_, i) => i !== index);
      console.log("Updated Known As Details:", updatedDetails); // Debug output
      return updatedDetails;
    });
  };

  const handleDurationIncrement = () => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      setCurrentDuration(newCounter);
      return newCounter;
    });
    setIsCounterClicked(true);
  };

  const handleDurationDecrement = () => {
    if (counter > 1) {
      setCounter((prevCounter) => {
        const newCounter = prevCounter - 1;
        setCurrentDuration(newCounter);
        return newCounter;
      });
      setIsCounterClicked(true);
    }
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

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown(openDropdown === type ? "" : type);
  };

  const onSubmit = async (data: TCreateDetails) => {
    try {
      setLoading(true);
      const ensureAllStrings = (arr: any[]) =>
        arr.flat().filter((item) => typeof item === "string");
      const newKnownAs = mergeAndRemoveDuplicates(
        results,
        currentKnownAsDetails,
        currentTitleResults
          ?.filter((title) => !knownAsDetails?.includes(title?.title))
          ?.flatMap((item) => item?.title)
      );
      // Flatten and ensure all items are strings
      const formattedKnownAs = ensureAllStrings(newKnownAs);
      const res = await fetch(`/api/tv/${tv?.id}/detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv?.id.toString(),
          details: [
            {
              title: data?.details?.title,
              native_title: data?.details?.native_title,
              country: country || detail?.country,
              known_as: formattedKnownAs,
              synopsis: currentSynopsis || data?.details?.synopsis,
              content_type: contentType || detail?.content_type,
              content_rating: contentRating || detail?.content_rating,
              status: status || detail?.status,
              duration: currentDuration || detail?.duration,
              episode: currentEpisode || tv?.number_of_episodes,
            },
          ],
        }),
      });
      if (res.status === 200) {
        reset();
        setResults([]);
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Bad Request");
      }
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      // Simulate a delay for the reset operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // reset logic here
      reset();
      setCurrentTitle(originalTitle);
      setCurrentNativeTitle(originalNativeTitle);
      setCurrentSynopsis(originalSynopsis);
      setCurrentCountry(originalCountry);
      setContentType(originalType);
      setContentRating(originalRating);
      setStatus(originalStatus);
      setCurrentDuration(originalDuration);
      setCurrentEpisode(originalEpisode);
      setResults([]);
      setTitleResults(originalTitleResults);
      setKnownAsDetails(originalKnownAsDetails);
    } catch (error) {
      console.error("Error resetting:", error);
    } finally {
      setResetLoading(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    adjustTextareaHeight();
  }, [currentSynopsis]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Primary Details
      </h1>
      <div className="mb-5 px-3">
        <label htmlFor="title">
          <b>Mostly Known as*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <input
            {...register("details.title")}
            onChange={(e) => setCurrentTitle(e.target.value)}
            name="details.title"
            type="text"
            className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
            defaultValue={initialTitle}
          />
        </div>
        <small className="text-muted-foreground opacity-80">
          Will appear as the main title
        </small>
      </div>
      <div className="flex">
        <div className="relative float-left w-[66.66667%] px-3 mb-5">
          <label htmlFor="native_title">
            <b>Native Title*</b>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("details.native_title")}
              onChange={(e) => setCurrentNativeTitle(e.target.value)}
              type="text"
              name="details.native_title"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
              defaultValue={initialNativeTitle}
            />
          </div>
          <small className="text-muted-foreground opacity-80">
            Original language title (Native Language) only
          </small>
        </div>
        <div className="relative float-left w-[33.33333%] px-3 mb-5">
          <label htmlFor="counter">
            <b>Country*</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.country")}
                type="text"
                name="details.country"
                readOnly
                autoComplete="off"
                placeholder={country}
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("country")}
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "country" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                >
                  {countryDetails?.map((item, idx) => {
                    const isContentRating = country
                      ? country === item?.value
                      : detail?.country === item?.value;
                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isContentRating
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        } `}
                        onClick={(e) => {
                          handleDropdownToggle("country");
                          setCountry(item?.value);
                          setCurrentCountry(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.label}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="mb-5 px-3">
        <label htmlFor="known_as">
          <b>Also Known As*</b>
        </label>
        <div className="flex flex-wrap relative w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#2196f3] rounded-md outline-none py-2 px-4 overflow-hidden">
          {titleResults
            ?.filter((title) => !knownAsDetails?.includes(title?.title))
            ?.map((item, idx: number) => (
              <span
                key={idx}
                className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
              >
                {item.title}
                <button
                  className="ml-1 text-red-500"
                  onClick={() => handleRemoveTitleResult(idx)}
                  type="button"
                >
                  x
                </button>
              </span>
            ))}
          {results?.map((result, index: number) => (
            <span
              key={index}
              className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
            >
              {result}
              <button
                className="ml-1 text-red-500"
                onClick={() => handleRemoveResult(index)}
                type="button"
              >
                x
              </button>
            </span>
          ))}
          {Array.isArray(knownAsDetails) &&
            knownAsDetails?.map((title, index: number) => (
              <span
                key={index}
                className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
              >
                {title}
                <button
                  className="ml-1 text-red-500"
                  onClick={() => handleRemoveKnownAsDetail(index)}
                  type="button"
                >
                  x
                </button>
              </span>
            ))}
          <input
            type="text"
            className="bg-transparent text-[#777] border-none text-sm outline-none pr-1 flex-grow ml-4 my-2"
            placeholder="Eg: Really Miss You; Hua Jian Ling"
            onKeyDown={handleKeyDown}
          />
        </div>
        <small className="text-muted-foreground opacity-80">
          Other names by which the dramas is known.
        </small>
      </div>
      <div className="mb-5 px-3">
        <label htmlFor="synopsis">
          <b>Synopsis*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <textarea
            {...register("details.synopsis")}
            onChange={(e) => setCurrentSynopsis(e.target.value)}
            name="details.synopsis"
            ref={textareaRef}
            className="w-full h-auto bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none overflow-hidden px-4 py-1"
            defaultValue={initialSynopsis}
          ></textarea>
        </div>
        <small className="text-muted-foreground opacity-80">
          If you&apos;re copying and pasting a synopsis from another site,
          please reference it at the bottom! Example:(Source: MyDramaList)
        </small>
      </div>
      <div className="flex">
        <div className="relative float-left w-[50%] px-3 mb-5">
          <label htmlFor="content_type">
            <b>Content Type*</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.content_type")}
                name="details.content_type"
                type="text"
                readOnly
                autoComplete="off"
                placeholder={contentType}
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("content_type")}
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "content_type" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ height: "160px" }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                >
                  {contentTypeDetail?.map((item, idx) => {
                    const isContentRating = contentType
                      ? contentType === item?.value
                      : detail?.content_type === item?.value;

                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isContentRating
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        }`}
                        onClick={() => {
                          handleDropdownToggle("content_type");
                          setContentType(item?.value);
                          setCurrentType(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.label}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
        <div className="relative float-left w-[50%] px-3 mb-5">
          <label htmlFor="content_rating">
            <b>Content Rating*</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.content_rating")}
                name="details.content_rating"
                type="text"
                readOnly
                autoComplete="off"
                placeholder={contentRating}
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("content_rating")}
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "content_rating" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ height: "230px" }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                >
                  {contentRatingDetail?.map((item, idx) => {
                    const isContentRating = contentRating
                      ? contentRating === item?.value
                      : detail?.content_rating === item?.value;
                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isContentRating
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        }`}
                        onClick={() => {
                          handleDropdownToggle("content_rating");
                          setContentRating(item?.value);
                          setCurrentRating(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.label}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="relative float-left w-[50%] px-3 mb-5">
          <label htmlFor="drama_status">
            <b>Drama Status*</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.status")}
                type="text"
                name="details.status"
                readOnly
                autoComplete="off"
                placeholder={status}
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("status")}
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "status" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ height: "235px" }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                >
                  {detailsList?.map((item, idx) => {
                    const isStatusSelected = status
                      ? status === item?.value
                      : detail?.status === item?.value;
                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isStatusSelected
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        } `}
                        onClick={() => {
                          handleDropdownToggle("status");
                          setStatus(item?.value);
                          setCurrentStatus(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.label}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
        <div className="relative float-left w-[50%] px-3 mb-5">
          <label htmlFor="duration">
            <b>Duration (# of minutes)*</b>
          </label>
          <div className="inline-block relative w-full mt-[5px]">
            <input
              {...register("details.duration")}
              type="number"
              name="details.duration"
              placeholder="e.g. 45"
              className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#dcdfe6] rounded-md outline-none py-2 px-4"
              value={
                currentDuration
                  ? currentDuration
                  : isCounterClicked
                  ? counter
                  : detail?.duration
                  ? detail?.duration
                  : tv?.episode_run_time?.[0]
              }
              onChange={(e) => setCurrentDuration(Number(e.target.value))}
            />
            <div className="absolute right-0 top-0">
              <button
                type="button"
                className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b border-b-[#dcdfe6] dark:border-b-[#46494a] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] border-t dark:border-t-0 border-t-[#dcdfe6] dark:border-t-[#46494a] border-r dark:border-r-0 border-r-[#dcdfe6] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                  currentDuration ===
                  (detail?.duration ?? tv?.episode_run_time[0])
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleDurationIncrement}
                disabled={
                  currentDuration ===
                  (detail?.duration ?? tv?.episode_run_time[0])
                    ? true
                    : false
                }
              >
                <IoMdArrowDropup className="" />
              </button>
              <button
                type="button"
                className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
                onClick={handleDurationDecrement}
              >
                <IoMdArrowDropdown />
              </button>
            </div>
            <small className="text-muted-foreground opacity-80">
              The total number of minutes in an average episode. If you are not
              sure, leave it blank.
            </small>
          </div>
        </div>
      </div>
      <div className="relative float-left w-[50%] px-3 mb-5">
        <label htmlFor="episode">
          <b>Episode*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <input
            {...register("details.episode")}
            name="details.episode"
            type="number"
            placeholder="e.g. 12"
            className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#dcdfe6] rounded-md outline-none py-2 px-4"
            value={
              currentEpisode
                ? currentEpisode
                : isEpCounterClicked
                ? epCounter
                : detail?.episode
                ? detail?.episode
                : tv?.number_of_episodes
            }
            onChange={(e) => setCurrentEpisode(Number(e.target.value))}
          />
          <div className="absolute right-0 top-0">
            <button
              type="button"
              className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b border-b-[#dcdfe6] dark:border-b-[#46494a] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] border-t dark:border-t-0 border-t-[#dcdfe6] dark:border-t-[#46494a] border-r dark:border-r-0 border-r-[#dcdfe6] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                currentEpisode === (detail?.episode ?? tv?.number_of_episodes)
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleEpIncrement}
              disabled={
                currentEpisode === (detail?.episode ?? tv?.number_of_episodes)
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
          <small className="text-muted-foreground opacity-80">
            The total number of minutes in an average episode. If you are not
            sure, leave it blank.
          </small>
        </div>
        <div className="inline-flex mt-5">
          <button
            type="submit"
            className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 mr-5 ${
              isSubmitEnabled || results?.length > 0
                ? "cursor-pointer"
                : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
            }`}
            disabled={isSubmitEnabled || results?.length > 0 ? false : true}
          >
            <span className="mr-1 pt-1">
              <ClipLoader color="#242526" loading={loading} size={19} />
            </span>
            Submit
          </button>
          <button
            className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
              isSubmitEnabled || results?.length > 0
                ? "cursor-pointer"
                : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
            }`}
            onClick={(e) => handleReset(e)}
            disabled={isSubmitEnabled || results?.length > 0 ? false : true}
          >
            {resetLoading ? (
              <span className="pt-1 mr-1">
                <ClipLoader color="#242526" loading={!loading} size={19} />
              </span>
            ) : (
              <span className="mr-1">
                <FaRegTrashAlt />
              </span>
            )}
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default TvDetails;
