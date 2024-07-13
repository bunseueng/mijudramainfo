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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoIosArrowDown,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

const TvDetails: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: content } = useQuery({
    queryKey: ["content"],
    queryFn: () => fetchContentRating(tv_id),
  });
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const [detail]: DramaDetails[] = (tvDetails?.details ||
    []) as unknown as DramaDetails[]; // get rid of array without using map or filter

  const { data: title } = useQuery({
    queryKey: ["title"],
    queryFn: () => fetchTitle(tv_id),
  });

  useEffect(() => {
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
    const isDrama = tv?.episode_run_time.join() > 50 ? "Drama" : "TV Show";
    const isEnded = tv?.status === "Ended" && "Finished Airing";
    const isUnconfirmed = tv?.status === "Pilot" && "Unconfirmed";
    const isOngoing = tv?.status === "Returning Series" && "Airing";
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
  ]);
  console.log(tv);
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
    setKnownAsDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  const handleDurationIncrement = () => {
    setCounter((prevCounter) => prevCounter + 1);
    setIsCounterClicked(true);
  };

  const handleDurationDecrement = () => {
    if (counter > 1) {
      setCounter((prevCounter) => prevCounter - 1);
      setIsCounterClicked(true);
    }
  };

  const handleEpIncrement = () => {
    setEpCounter((prevCounter) => prevCounter + 1);
    setIsEpCounterClicked(true);
  };

  const handleEpDecrement = () => {
    if (epCounter > 1) {
      setEpCounter((prevCounter) => prevCounter - 1);
      setIsEpCounterClicked(true);
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const mergeAndRemoveDuplicates = (array1: any, array2: any): any => {
    const map = new Map<string, any>();
    array1?.forEach((item: any) => map.set(item?.id, item));
    array2?.forEach((item: any) => map.set(item?.name, item));
    return Array.from(map.values());
  };

  const onSubmit = async (data: TCreateDetails) => {
    try {
      const newKnownAs = mergeAndRemoveDuplicates(detail?.known_as, results);
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
              known_as: newKnownAs,
              synopsis: data?.details?.synopsis,
              content_type: contentType || detail?.content_type,
              content_rating: contentRating || detail?.content_rating,
              status: status || detail?.status,
              duration: counter || detail?.duration,
              episode: isEpCounterClicked ? epCounter : tv?.number_of_episodes,
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
    }
  };

  return (
    <form className="py-3 px-4">
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
            type="text"
            className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
            defaultValue={tv?.title || tv?.name || detail?.title}
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
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
              defaultValue={tv?.original_name || detail?.native_title}
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
                name="country"
                readOnly
                autoComplete="off"
                placeholder={country}
                className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
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
                  className={`w-full absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 `}
                >
                  {countryDetails?.map((item, idx) => {
                    const isContentRating = country
                      ? country === item?.value
                      : detail?.country === item?.value;
                    return (
                      <li
                        className={`px-5 py-2 cursor-pointer ${
                          isContentRating ? "text-[#409eff] bg-[#2a2b2c]" : ""
                        } `}
                        onClick={() => {
                          handleDropdownToggle("country");
                          setCountry(item?.value);
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
          {titleResults?.map((item, idx) => (
            <span key={idx} className="mr-2">
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
          {results.map((result, index) => (
            <span key={index} className="mr-2">
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
          {knownAsDetails.map((title: any, index: number) => (
            <span key={index} className="mr-2">
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
            className="bg-transparent text-[#777] border-none text-sm outline-none pr-1 flex-grow ml-4"
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
            className="w-full min-h-[116.6px] h-[221.6px] bg-[#3a3b3c] text-[#ffffffcc] rounded-md shadow-md overflow-hidden px-4 py-1"
            defaultValue={tv?.overview || detail?.synopsis}
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
                type="text"
                name="content_type"
                readOnly
                autoComplete="off"
                placeholder={contentType}
                className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-pointer"
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
                  className={`w-full absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 `}
                >
                  {contentTypeDetail?.map((item, idx) => {
                    const isContentRating = contentType
                      ? contentType === item?.value
                      : detail?.content_type === item?.value;

                    return (
                      <li
                        className={`px-5 py-2 cursor-pointer ${
                          isContentRating ? "text-[#409eff] bg-[#2a2b2c]" : ""
                        } `}
                        onClick={() => {
                          handleDropdownToggle("content_type");
                          setContentType(item?.value);
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
                type="text"
                name="content_rating"
                readOnly
                autoComplete="off"
                placeholder={contentRating}
                className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-pointer"
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
                  className={`w-full absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 `}
                >
                  {contentRatingDetail?.map((item, idx) => {
                    const isContentRating = contentRating
                      ? contentRating === item?.value
                      : detail?.content_rating === item?.value;
                    return (
                      <li
                        className={`px-5 py-2 cursor-pointer ${
                          isContentRating ? "text-[#409eff] bg-[#2a2b2c]" : ""
                        } `}
                        onClick={() => {
                          handleDropdownToggle("content_rating");
                          setContentRating(item?.value);
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
                name="status"
                readOnly
                autoComplete="off"
                placeholder={status}
                className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-pointer"
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
                  className={`w-full absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 `}
                >
                  {detailsList?.map((item, idx) => {
                    const isStatusSelected = status
                      ? status === item?.value
                      : detail?.status === item?.value;
                    return (
                      <li
                        className={`px-5 py-2 cursor-pointer ${
                          isStatusSelected ? "text-[#409eff] bg-[#2a2b2c]" : ""
                        } `}
                        onClick={() => {
                          handleDropdownToggle("status");
                          setStatus(item?.value);
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
          <div className="inline-block relative w-full mt-[10px]">
            <input
              {...register("details.duration")}
              type="number"
              placeholder="e.g. 45"
              className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
              value={
                isCounterClicked
                  ? counter
                  : detail?.duration
                  ? detail?.duration
                  : tv?.episode_run_time?.[0]
              }
              onChange={(e) => setCounter(Number(e.target.value))}
            />
            <div className="absolute right-0 top-0">
              <button
                type="button"
                className="block bg-[#3a3b3c] border-b-2 border-b-[#46494a] border-l-2 border-l-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group"
                onClick={handleDurationIncrement}
              >
                <IoMdArrowDropup className="" />
              </button>
              <button
                type="button"
                className="block bg-[#3a3b3c] border-l-2 border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
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
            type="number"
            placeholder="e.g. 12"
            className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
            value={
              isEpCounterClicked
                ? epCounter
                : detail?.episode
                ? detail?.episode
                : tv?.number_of_episodes
            }
            onChange={(e) => setEpCounter(Number(e.target.value))}
          />
          <div className="absolute right-0 top-0">
            <button
              type="button"
              className="block bg-[#3a3b3c] border-b-2 border-b-[#46494a] border-l-2 border-l-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group"
              onClick={handleEpIncrement}
            >
              <IoMdArrowDropup className="" />
            </button>
            <button
              type="button"
              className="block bg-[#3a3b3c] border-l-2 border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
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
        <button
          type="submit"
          className="bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 cursor-pointer hover:opacity-80 transform duration-300 rounded-md mt-10"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TvDetails;
