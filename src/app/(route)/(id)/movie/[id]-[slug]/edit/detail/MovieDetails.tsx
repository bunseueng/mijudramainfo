"use client";

import {
  contentRatingDetail,
  contentTypeDetail,
  countryDetails,
  detailsList,
} from "@/helper/item-list";
import { DramaDetails, Movie, movieId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  IoIosArrowDown,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import { mergeAndRemoveDuplicates } from "@/app/actions/mergeAndRemove";
import { Loader2 } from "lucide-react";
import { useMovieData } from "@/hooks/useMovieData";

const MovieDetails: React.FC<movieId & Movie> = ({
  movie_id,
  movieDetails,
}) => {
  const { movie } = useMovieData(movie_id);
  const title = useMemo(
    () => movie?.alternative_titles?.titles || [],
    [movie?.alternative_titles?.titles]
  );
  const [certification, setCertification] = useState<string | null>(null);
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

  const getCertificationByCountry = useCallback(
    async (countryCode: string) => {
      if (!movie?.releases?.countries) {
        return "N/A";
      }
      // Normalize to uppercase to avoid case sensitivity issues
      const certificationData = movie?.releases?.countries?.find(
        (release: any) =>
          release.iso_3166_1.toUpperCase() === countryCode.toUpperCase()
      );
      return certificationData?.certification || "N/A"; // Default to "N/A" if not found
    },
    [movie?.releases?.countries]
  );

  useEffect(() => {
    const fetchCountryAndCertification = async () => {
      const country = await getUserCountry();

      if (country) {
        const cert = await getCertificationByCountry(country);
        setCertification(cert);
      } else {
        // Fallback to US certification if no country found
        const cert = await getCertificationByCountry("US");
        setCertification(cert);
      }
    };

    // Ensure movie data is available before calling the function
    if (movie?.releases?.countries) {
      fetchCountryAndCertification();
    }
  }, [movie, getCertificationByCountry]);
  const [detail]: DramaDetails[] = (movieDetails?.details ||
    []) as unknown as DramaDetails[]; // get rid of array without using map or filter

  const [results, setResults] = useState<string[]>([]);
  const [titleResults, setTitleResults] = useState<any[]>([]);
  const [knownAsDetails, setKnownAsDetails] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(1);
  const [isCounterClicked, setIsCounterClicked] = useState<boolean>(false);
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
  const hasNumber12Or13 = certification === "12" || "13";
  const hasNumber15 = certification === "15";
  const hasNumber18 = certification === "18";
  const isRestricted = certification === "R";
  const teens13 = hasNumber12Or13 && "13+- Teens 13 or older";
  const teens15 = hasNumber15 && "15+- Teens 15 or older";
  const teens18 = hasNumber18 && "18+ Restricted (violence & profanity)";
  const restricted =
    isRestricted && "R - Restricted Screening (nudity & violence)";
  const isNoRating = certification === "N/A" && "Not Yet Rating";
  const NR = certification === "NR" && "Not Yet Rating";
  const isEnded = movie?.status === "Released" && "Finished Airing";
  const isUnconfirmed = movie?.status === "Pilot" && "Unconfirmed";
  const isOngoing = movie?.status === "Returning Series" && "Airing";
  const initialTitle = movie?.title || movie?.name || detail?.title || "";
  const initialNativeTitle =
    movie?.original_title || detail?.native_title || "";
  const initialSynopsis = movie?.overview || detail?.synopsis || "";
  const initialDuration = detail?.duration || movie?.runtime || "";
  const initialTitleResults = title || "";
  const initialKnownAsDetails = detail?.known_as || "";
  const [initialDurationSet, setInitialDurationSet] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initialTitle);
  const [currentNativeTitle, setCurrentNativeTitle] =
    useState(initialNativeTitle);
  const [currentSynopsis, setCurrentSynopsis] = useState(initialSynopsis);
  const [currentCountry, setCurrentCountry] = useState(country);
  const [currentType, setCurrentType] = useState(contentType);
  const [currentRating, setCurrentRating] = useState(contentRating);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentDuration, setCurrentDuration] = useState(initialDuration);
  const [currentTitleResults, setCurrentTitleResults] = useState(titleResults);
  const [currentKnownAsDetails, setCurrentKnownAsDetails] =
    useState(knownAsDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const originalTitle = initialTitle;
  const originalNativeTitle = initialNativeTitle;
  const originalSynopsis = initialSynopsis;
  const originalCountry = detail?.country || movie?.type?.join(" ") || "";
  const originalType = detail?.content_type || "";
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
    titleResults,
    knownAsDetails,
  ]);

  useEffect(() => {
    if (detail?.country?.length > 0 ? detail?.country : movie?.type) {
      setCountry(
        detail?.country?.length > 0 ? detail?.country : movie?.type?.join(" ")
      );
    }
    if (detail?.content_type?.length > 0 ? detail?.content_type : "Movie") {
      setContentType(
        detail?.content_type?.length > 0 ? detail?.content_type : "Movie"
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
    movie?.type,
    movie?.runtime,
    movie?.status,
    detail?.content_rating,
    detail?.content_type,
    detail?.country,
    detail?.status,
    NR,
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
    if (title) {
      setTitleResults(title);
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

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown(openDropdown === type ? "" : type);
  };

  const onSubmit = async (data: TCreateDetails) => {
    try {
      setLoading(true);
      setIsSubmitting(true);
      setIsResetting(false);
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

      // Use current state values instead of initial values
      const res = await fetch(`/api/movie/${movie?.id}/detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie?.id.toString(),
          details: [
            {
              title:
                currentTitle !== originalTitle ? currentTitle : detail?.title,
              native_title:
                currentNativeTitle !== originalNativeTitle
                  ? currentNativeTitle
                  : detail?.native_title,
              country: country !== originalCountry ? country : detail?.country,
              known_as: formattedKnownAs,
              synopsis:
                currentSynopsis !== originalSynopsis
                  ? currentSynopsis
                  : detail?.synopsis,
              content_type:
                contentType !== originalType
                  ? contentType
                  : detail?.content_type,
              content_rating:
                contentRating !== originalRating
                  ? contentRating
                  : detail?.content_rating,
              status: status !== originalStatus ? status : detail?.status,
              duration:
                currentDuration !== originalDuration
                  ? currentDuration
                  : detail?.duration,
            },
          ],
        }),
      });

      if (res.status === 200) {
        reset();
        setResults([]);
        setIsSubmitted(true);
        toast.success("Success");
        setIsSubmitEnabled(false);
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        toast.error("Bad Request");
      }
    } catch (error: any) {
      toast.error("Bad Request");
      throw new Error(error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleReset = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setResetLoading(true);
    setIsResetting(true);
    setIsSubmitting(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      reset();
      setCurrentTitle(originalTitle);
      setCurrentNativeTitle(originalNativeTitle);
      setCurrentSynopsis(originalSynopsis);
      setCurrentCountry(originalCountry);
      setContentType(originalType);
      setContentRating(originalRating);
      setStatus(originalStatus);
      setCurrentDuration(originalDuration);
      setResults([]);
      setCurrentTitleResults(originalTitleResults);
      setCurrentKnownAsDetails(originalKnownAsDetails);
      setIsSubmitted(false);
      setIsSubmitEnabled(false);
    } catch (error) {
      console.error("Error resetting:", error);
    } finally {
      setResetLoading(false);
      setIsResetting(false);
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

  // Update the useEffect that sets initial values to also handle duration properly
  useEffect(() => {
    if (!initialDurationSet) {
      const initialDurationValue = detail?.duration || movie?.runtime || "";
      setCurrentDuration(initialDurationValue);
      setCounter(Number(initialDurationValue) || 1);
      setInitialDurationSet(true);
    }
  }, [detail?.duration, movie?.runtime, initialDurationSet]);

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
            defaultValue={
              currentTitle !== originalTitle
                ? currentTitle
                : detail?.title || currentTitle
            }
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
              defaultValue={
                currentNativeTitle !== originalNativeTitle
                  ? currentNativeTitle
                  : detail?.native_title || currentNativeTitle
              }
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
            defaultValue={
              currentSynopsis !== originalSynopsis
                ? currentSynopsis
                : detail?.synopsis || currentSynopsis
            }
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
            <b>Movie Status*</b>
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
                  : movie?.runtime || ""
              }
              onChange={(e) => setCurrentDuration(Number(e.target.value))}
            />
            <div className="absolute right-0 top-0">
              <button
                type="button"
                className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b border-b-[#dcdfe6] dark:border-b-[#46494a] border-l border-l-[#dcdfe6] dark:border-l-[#46494a] border-t dark:border-t-0 border-t-[#dcdfe6] dark:border-t-[#46494a] border-r dark:border-r-0 border-r-[#dcdfe6] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                  currentDuration === (detail?.duration ?? movie?.runtime)
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleDurationIncrement}
                disabled={
                  currentDuration === (detail?.duration ?? movie?.runtime)
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
        <div className="inline-flex mt-5">
          <button
            name="Submit"
            type="submit"
            className={`flex items-center text-white px-5 py-2 rounded-md mb-10 mr-5 transform duration-300 ${
              isSubmitEnabled || results?.length > 0
                ? "bg-[#5cb85c] border-[1px] border-[#5cb85c] hover:opacity-80 cursor-pointer"
                : "bg-[#b3e19d] border-[1px] border-[#b3e19d] cursor-not-allowed"
            } ${
              isResetting || isSubmitted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={
              (!isSubmitEnabled && results?.length === 0) ||
              isResetting ||
              isSubmitted ||
              loading
            }
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
          </button>
          <button
            name="Reset"
            type="button"
            className={`flex items-center px-5 py-2 rounded-md mb-10 transform duration-300 ${
              (isSubmitEnabled || results?.length > 0) && !isSubmitted
                ? "text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] hover:opacity-80 cursor-pointer"
                : "text-[#c0c4cc] border-[1px] border-[#ebeef5] cursor-not-allowed"
            } ${
              isSubmitting || isSubmitted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleReset}
            disabled={
              (!isSubmitEnabled && results?.length === 0) ||
              isSubmitting ||
              isSubmitted ||
              resetLoading
            }
          >
            {resetLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default MovieDetails;
