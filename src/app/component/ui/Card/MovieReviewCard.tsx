"use client";

import Discuss from "@/app/(route)/(id)/tv/[id]-[slug]/discuss/Discuss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";
import { IoHeartSharp } from "react-icons/io5";
import { LuCalendarClock } from "react-icons/lu";
import { TiStar } from "react-icons/ti";
import MovieReviewDBCard from "./MovieReviewDBCard";
import MovieMediaPhoto from "@/app/(route)/(id)/movie/[id]-[slug]/Media";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { handleProfileClick } from "@/app/actions/handleProfileClick";
import { fetchTrailer } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import { SkeletonMediaPhoto } from "../Loading/TrailerLoading";

const MovieReviewCard = ({
  review,
  image,
  video,
  movie_id,
  recommend,
  movie,
  user,
  users,
  getComment,
  getReview,
}: any) => {
  const [mediaActive, setMediaActive] = useState<string>("videos");
  const [openTrailer, setOpenTrailer] = useState<boolean>(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set()
  );
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

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

  // Deduplicate video keys
  const uniqueKeys = video
    ? [...new Set(video.map((item: any) => item.key))]
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideos(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["movie_videos", uniqueKeys],
    queryFn: () => fetchTrailer(uniqueKeys as string[]),
    staleTime: 3600000,
    refetchOnWindowFocus: false,
    gcTime: 3600000,
    enabled: !!uniqueKeys.length && shouldLoadVideos,
  });

  if (isLoading) {
    return <SkeletonMediaPhoto />;
  }

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      <div ref={videoContainerRef}>
        <MovieMediaPhoto
          movie={movie}
          mediaActive={mediaActive}
          setMediaActive={setMediaActive}
          image={image}
          video={videos}
          openTrailer={openTrailer}
          setOpenTrailer={setOpenTrailer}
          movie_id={movie_id}
        />
      </div>

      <div className="relative top-0 left-0 mt-5 overflow-hidden">
        <div className="border-t-[1px] border-t-slate-400 pt-3">
          <h1 className="text-2xl font-bold py-4">Recommendations</h1>
          {recommend?.length === 0 ? (
            <p className="text-xl font-bold py-5">
              There are no recommendations for {movie?.name} yet!
            </p>
          ) : (
            <div className="flex items-center overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
              {recommend?.map((item: any, index: number) => (
                <div className="w-[270px] h-[180px] mr-4" key={index}>
                  <div className="w-[270px] h-[180px] bg-cover">
                    <Link
                      prefetch={false}
                      href={`/movie/${item?.id}-${spaceToHyphen(
                        item?.title || item?.name
                      )}`}
                      className="hover:relative transform duration-100 group"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${
                          item?.backdrop_path || item?.poster_path
                        }`}
                        alt={
                          `${item?.name || item?.title}'s Poster` ||
                          "Movie Poster"
                        }
                        width={600}
                        height={600}
                        priority
                        className="w-[270px] h-[150px] bg-cover object-cover rounded-lg"
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
      </div>

      <div className="border-t-[1px] border-t-slate-400 pt-3 mt-10">
        {review?.length === 0 && getReview?.length === 0 ? (
          <div className="border-[1px] border-[#00000024] rounded-md mt-8">
            <div className="flex items-center justify-between text-[#176093] bg-[#a5dafa] px-5 py-2">
              <h1 className="text-md font-bold">Reviews</h1>
              <Link
                prefetch={false}
                href={`/movie/${movie_id}/write_reviews`}
                className="text-md"
              >
                Write Review
              </Link>
            </div>
            <p className="p-5 font-semibold">
              We don&#39;t have any reviews for {movie?.name}. Would you like to
              write one?
            </p>
          </div>
        ) : (
          <div className="border-[1px] border-[#00000024] rounded-md mt-8">
            <div className="flex items-center justify-between text-[#176093] bg-[#a5dafa] px-5 py-2">
              <h1 className="text-md font-bold">Reviews</h1>
              <Link
                prefetch={false}
                href={`/movie/${movie_id}/write_reviews`}
                className="text-md"
              >
                Write Review
              </Link>
            </div>
            {review?.slice(0, 2)?.map((review: any, idx: number) => (
              <div className="flex flex-col" key={idx}>
                <div className="flex bg-[#f8f8f8] dark:bg-[#1b1c1d] p-2 md:p-5">
                  <Link
                    href={`https://www.themoviedb.org/u/${review?.author_details?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      handleProfileClick(e, review?.author_details?.username)
                    }
                  >
                    <Image
                      src={
                        review.author_details?.avatar_path
                          ? `https://image.tmdb.org/t/p/original/${review.author_details?.avatar_path}`
                          : "/placeholder-image.avif"
                      }
                      alt={
                        `${review?.name || review?.title}'s Profile` ||
                        "Person Profile"
                      }
                      width={100}
                      height={100}
                      priority
                      className="size-[50px] object-cover rounded-full"
                    />
                  </Link>

                  <div className="flex flex-col text-black pl-5">
                    <h1 className="text-black dark:text-white text-sm md:text-md">
                      Review by{" "}
                      <Link
                        href={`https://www.themoviedb.org/u/${review?.author_details?.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) =>
                          handleProfileClick(
                            e,
                            review?.author_details?.username
                          )
                        }
                      >
                        {review?.author_details?.username}
                      </Link>
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center md:pt-2">
                      {review?.author_details?.rating && (
                        <h1 className="w-[60px] text-black dark:text-white bg-black p-1 rounded-full flex flex-row items-center mr-2 my-2 md:my-0">
                          <BsStars className="text-white" size={15} />
                          <span className="text-white text-xs px-2">
                            {review?.author_details?.rating?.toFixed(1)}
                          </span>
                        </h1>
                      )}
                      <p className="text-black dark:text-white text-sm font-semibold">
                        Written by{" "}
                        <Link
                          prefetch={false}
                          href={`https://www.themoviedb.org/u/${review?.author_details?.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            handleProfileClick(
                              e,
                              review?.author_details?.username
                            )
                          }
                        >
                          {review?.author_details?.username}
                        </Link>{" "}
                        on {formatDate(review?.updated_at)}
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
            ))}
            <MovieReviewDBCard
              getReview={getReview}
              movie_id={movie_id}
              user={user}
              review={review}
            />
          </div>
        )}
      </div>

      <div className="border-t-[1px] border-t-slate-400 pt-10 mt-10">
        <h1 className="text-xl font-bold">Social</h1>
        <Discuss
          user={user}
          users={users}
          getComment={getComment}
          tv_id={movie_id}
          type="movie"
        />
      </div>
    </div>
  );
};

export default MovieReviewCard;
