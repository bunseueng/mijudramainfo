"use client";

import {
  fetchAllPopularTvShows,
  fetchContentRating,
  fetchLanguages,
  fetchReview,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import {
  currentUserProps,
  DramaDB,
  ITvReview,
  SearchParamsType,
} from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ShareButton } from "@/app/component/ui/Button/ShareButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
import TvInfo from "../TvInfo";
import ReviewHeader from "./ReviewHeader";
import ReviewFilters from "./ReviewFilters";
import ReviewItem from "./ReviewItem";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export type ReviewType = {
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
    queryKey: ["drama", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: language } = useQuery({
    queryKey: ["tvLanguage", tv_id],
    queryFn: fetchLanguages,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: content } = useQuery({
    queryKey: ["tvContent", tv_id],
    queryFn: () => fetchContentRating(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["tvCast", tv_id],
    queryFn: fetchAllPopularTvShows,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: review } = useQuery({
    queryKey: ["review", tv_id],
    queryFn: () => fetchReview(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
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
        `https://image.tmdb.org/t/p/w92/${tv?.poster_path}`
      );
      if (color) {
        // Use the color string directly
        setDominantColor(color);
      } else {
        console.error("No valid color returned");
      }
    }
  }, [tv?.poster_path]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [extractColor]);

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
      <ReviewHeader tv={tv} tv_id={tv_id} dominantColor={dominantColor} />

      <div className="max-w-6xl mx-auto mt-0 py-2 lg:py-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start px-2">
          {/* Main Content */}
          <div className="w-full h-full md:w-[66.66667%] md:px-3">
            <div className="bg-white dark:bg-[#242424] border rounded-md">
              <div className="w-full bg-sky-300 dark:bg-[#242424] border-b boder-b-bg-slate-200 dark:border-b-[#272727] rounded-md p-5">
                <h1 className="text-xl text-sky-900 dark:text-[#2196f3] font-bold">
                  {tv?.name}
                </h1>
              </div>

              <ReviewFilters
                tv_id={tv_id}
                reviewType={reviewType}
                languages={languages}
                status={status}
                openDropdown={openDropdown}
                getReview={getReview}
                handleDropdownToggle={handleDropdownToggle}
                setReviewType={setReviewType}
                setLanguages={setLanguages}
                setStatus={setStatus}
                selectBox={selectBox}
              />

              {/* Reviews List */}
              {review?.results?.length === 0 && getReview?.length === 0 ? (
                <div className="border-[1px] border-[#00000024] rounded-md mt-8">
                  <div className="flex items-center justify-between text-[#176093] bg-[#a5dafa] px-5 py-2">
                    <h1 className="text-md font-bold">Reviews</h1>
                    <Link
                      href={`/tv/${tv_id}/write_reviews`}
                      className="text-md"
                    >
                      Write Review
                    </Link>
                  </div>
                  <p className="p-5 font-semibold">
                    We don&#39;t have any reviews for {tv?.name}. Would you like
                    to write one?
                  </p>
                </div>
              ) : (
                <>
                  {currentItems?.map((review: ITvReview, idx: number) => (
                    <ReviewItem
                      key={idx}
                      review={review}
                      tv={tv}
                      idx={idx}
                      currentUser={currentUser}
                      expandedReviews={expandedReviews}
                      loadingStates={loadingStates}
                      toggleExpand={toggleExpand}
                      submitReviewHelpful={submitReviewHelpful}
                    />
                  ))}
                </>
              )}

              {/* Pagination */}
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

          {/* Sidebar */}
          <div className="w-full h-full md:w-[33.33333%] mt-4 md:mt-0 md:px-3">
            <div className="flex flex-col items-center content-center max-w-[97rem] mx-auto py-10 md:py-4 border rounded-md bg-white p-2 dark:bg-[#242424]">
              <LazyImage
                src={`https://image.tmdb.org/t/p/${
                  tv?.poster_path ? "w342" : "w300"
                }/${tv?.poster_path || tv?.backdrop_path}`}
                alt={`${tv?.name}'s Poster`}
                width={350}
                height={480}
                quality={100}
                priority
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
