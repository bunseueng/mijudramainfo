"use client";

import React, { useEffect, useRef } from "react";
import CircleRating from "@/app/component/ui/CircleRating/CircleRating";
import {
  MdBookmarkAdd,
  MdFormatListBulletedAdd,
  MdOutlineFavorite,
} from "react-icons/md";
import PlayTrailerBtn from "./PlayTrailerBtn";
import {
  fetchCastCredit,
  fetchContentRating,
  fetchImages,
  fetchKeyword,
  fetchLanguages,
  fetchRecommendation,
  fetchReview,
  fetchTitle,
  fetchTrailer,
  fetchTv,
  fetchVideos,
} from "@/app/actions/fetchMovieApi";
import DramaCast from "./DramaCast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import RatingModal from "@/app/component/ui/CircleRating/RatingModal";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { Image as AntImage } from "antd";
import Image from "next/image";
import { DramaDetails, DramaReleasedInfo } from "@/helper/type";
import { formatDate } from "@/app/actions/formatDate";
import ColorThief from "colorthief";
import { getTextColor } from "@/app/actions/getTextColor";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

const DramaMain = ({
  getDrama,
  getReview,
  tv_id,
  existedWatchlist,
  existedFavorite,
  user,
  existingRatings,
  userRating,
  getComment,
  users,
}: any) => {
  const router = useRouter();
  const [openList, setOpenList] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [textColor, setTextColor] = useState("#FFFFFF"); // Default to white text

  const { data: tv, isLoading } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: trailer } = useQuery({
    queryKey: ["trailer"],
    queryFn: () => fetchTrailer(tv_id),
  });
  const { data: cast } = useQuery({
    queryKey: ["cast"],
    queryFn: () => fetchCastCredit(tv_id),
  });
  const { data: language } = useQuery({
    queryKey: ["language"],
    queryFn: () => fetchLanguages(),
  });
  const { data: content } = useQuery({
    queryKey: ["content"],
    queryFn: () => fetchContentRating(tv_id),
  });
  const { data: keyword } = useQuery({
    queryKey: ["keyword"],
    queryFn: () => fetchKeyword(tv_id),
  });
  const { data: title } = useQuery({
    queryKey: ["title"],
    queryFn: () => fetchTitle(tv_id),
  });
  const { data: review } = useQuery({
    queryKey: ["review"],
    queryFn: () => fetchReview(tv_id),
  });
  const { data: image } = useQuery({
    queryKey: ["image"],
    queryFn: () => fetchImages(tv_id),
  });
  const { data: video } = useQuery({
    queryKey: ["video"],
    queryFn: () => fetchVideos(tv_id),
  });
  const { data: recommend } = useQuery({
    queryKey: ["recommend"],
    queryFn: () => fetchRecommendation(tv_id),
  });
  const { data: allTvShows } = useQuery({
    queryKey: ["allTvShows"],
    queryFn: fetchRecommendation,
  });
  // Getting Crew
  const castCredit = cast?.crew?.map((item: any) => item);
  const director = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Directing"
  );
  const screenwriter = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Creator"
  );
  const original_country = tv?.origin_country?.[0];

  const matchedLanguage = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );
  const allTvShowsArray = Array.isArray(allTvShows) ? allTvShows : [];
  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === tv.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  const keywords = keyword?.results;
  const formattedKeywords = keywords?.map((key: any, index: number) => {
    const capitalizedKeyword =
      key.name.charAt(0).toUpperCase() + key.name.slice(1);
    return index === keywords?.length - 1
      ? capitalizedKeyword
      : capitalizedKeyword + ", ";
  });
  const formattedKeywordsDB = getDrama?.genres_tags[0]?.tag
    ?.map((key: any, index: number) => {
      const capitalizedKeyword =
        key.name.charAt(0).toUpperCase() + key.name.slice(1);
      return index === getDrama.genres_tags[0].tag.length - 1
        ? capitalizedKeyword
        : capitalizedKeyword + ", ";
    })
    .join("");
  const genres = tv?.genres;
  const tvRating = existingRatings?.map((item: any) => item?.rating);
  const sumRating = tvRating?.reduce(
    (acc: any, rating: number) => acc + rating,
    0
  );
  const calculatedRating = sumRating / existingRatings?.length;

  const [detail]: DramaDetails[] = (getDrama?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (getDrama?.released_information ||
    []) as unknown as DramaReleasedInfo[];

  const formattedFirstAirDate = tv?.first_air_date
    ? formatDate(tv.first_air_date)
    : "TBA";
  const formattedLastAirDate = tv?.last_air_date
    ? formatDate(tv.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const formattedLastAirDateDB = info?.end_date
    ? formatDate(info.end_date)
    : "";

  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/watchlist/${tv?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: tv?.id,
        }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 404) {
        toast.error("Already in the watchlist.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDelete = async () => {
    try {
      const res = await fetch(`/api/watchlist/${tv?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: tv?.id,
        }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onFavorite = async () => {
    try {
      const res = await fetch(`/api/favorite/${tv?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: tv?.id,
        }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDeleteFavorite = async () => {
    try {
      const res = await fetch(`/api/favorite/${tv?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: tv?.id,
        }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief?.getColor(imgRef.current);
      const rgbaColor = `rgba(${color.join(",")}, 1)`; // Convert to RGBA with full opacity
      const gradientBackground = `linear-gradient(to right, ${rgbaColor} calc((50vw - 170px) - 340px), ${rgbaColor.replace(
        "1)",
        "0.84)"
      )} 50%, ${rgbaColor.replace("1)", "0.84)")} 100%)`;

      setDominantColor(gradientBackground);
      const textColor = getTextColor(...color);
      setTextColor(textColor);
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
    return <SearchLoading />;
  }
  return (
    <>
      <div className="w-full h-full">
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat h-auto"
          style={{
            backgroundPosition: "calc(50vw - 510px) top",
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${
              tv?.backdrop_path || tv?.poster_path
            })`,
          }}
        >
          <div
            className="w-full flex flex-wrap items-center justify-center h-full"
            style={{
              backgroundImage: dominantColor
                ? (dominantColor as string | undefined)
                : "linear-gradient(to right, rgba(24, 40, 72, 1) calc((50vw - 170px) - 340px), rgba(24, 40, 72, 0.84) 50%, rgba(24, 40, 72, 0.84) 100%)",
            }}
          >
            <div className="px-3">
              <div className="flex flex-col md:flex-row content-center max-w-6xl mx-auto md:py-8 md:px-2 lg:px-5 mt-5">
                <Image
                  ref={imgRef}
                  onLoad={extractColor}
                  src={
                    getDrama?.cover ||
                    `https://image.tmdb.org/t/p/original/${
                      tv?.poster_path || tv?.backdrop_path
                    }`
                  }
                  alt={detail?.title || tv?.name}
                  width={500}
                  height={300}
                  className="block align-middle !w-[350px] md:!min-w-[350px] !h-[480px] bg-cover object-cover rounded-lg md:pl-0"
                />

                <div className="md:pl-4 lg:pl-8 py-5">
                  <div className="relative">
                    <h2
                      className="text-3xl font-bold text-white"
                      style={{ color: textColor }}
                    >
                      <span className="cursor-pointer hover:opacity-50 duration-300">
                        {detail?.title || tv?.title || tv?.name}
                      </span>{" "}
                      ({getYearFromDate(tv?.first_air_date || tv?.release_date)}
                      )
                    </h2>
                  </div>
                  <div className="mb-2 text-1xl font-bold text-white">
                    <span
                      className="cursor-pointer hover:opacity-50 duration-300"
                      style={{ color: textColor }}
                    >
                      {tv?.genres?.map((genre: any, index: number) => {
                        return index === genres.length - 1
                          ? genre.name
                          : genre.name + ", ";
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center py-5">
                    <CircleRating
                      rating={
                        tv && tv.vote_average && calculatedRating
                          ? (
                              (tv.vote_average * tv.vote_count +
                                calculatedRating * calculatedRating) /
                              (tv.vote_count + calculatedRating)
                            ).toFixed(1)
                          : calculatedRating
                          ? calculatedRating.toFixed(1)
                          : tv && tv.vote_average
                          ? tv.vote_average.toFixed(1)
                          : "NR"
                      }
                    />

                    <p
                      className="inline-block text-white text-1xl md:text-md lg:text-1xl font-bold uppercase my-3 md:pl-2 lg:pl-5"
                      style={{
                        color: textColor,
                        width: "auto",
                        overflow: "hidden",
                      }}
                    >
                      From {tv?.vote_count + existingRatings?.length}
                      {tv?.vote_count < 2 ? " user" : " users"}
                    </p>
                    {userRating.length > 0 ? (
                      <div
                        className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-1 pl-4 py-1 md:ml-3"
                        onClick={() => setModal(!modal)}
                      >
                        <div className="flex items-center justify-center">
                          <div className="flex items-center text-white font-bold cursor-pointer transform">
                            <div className="flex items-center font-bold">
                              Your vibe{" "}
                            </div>
                            <div className="flex items-center font-bold ml-2">
                              <span className="text-[#21D07A] text-xl decoration-2 decoration-white">
                                {userRating[0]?.rating * 10}
                                <span className="self-start text-xs pt-1">
                                  %
                                </span>
                              </span>
                            </div>
                            {userRating[0]?.emojiImg && (
                              <>
                                <div className="inline-block mx-2 h-6 w-px bg-white/30"></div>
                                <ul className="flex items-center justify-between">
                                  <li className="!mx-0 w-8 h-8 md:w-9 md:h-9 md:bg-[#032541] mt-1">
                                    <Image
                                      src={userRating[0]?.emojiImg}
                                      alt="icon"
                                      width={100}
                                      height={100}
                                      priority
                                      className="w-6 h-6 md:w-7 md:h-7"
                                    />
                                  </li>
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-4 pl-4 py-[9px] md:ml-3"
                        onClick={() => setModal(!modal)}
                      >
                        <div className="flex items-center justify-center">
                          <div className="flex items-center text-white font-bold cursor-pointer transform">
                            <div className="flex items-center font-bold text-xs lg:text-md">
                              What&apos;s your{" "}
                              <span className="border-b-[1px] border-b-cyan-500 ml-2 md:ml-0 lg:ml-2 pt-1">
                                Vibe
                              </span>
                              ?{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {modal && (
                      <RatingModal
                        modal={modal}
                        setModal={setModal}
                        id={tv_id}
                        user={user}
                        userRating={userRating}
                        tv={tv}
                      />
                    )}
                  </div>
                  <div className="flex items-center mt-2 mb-8">
                    <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
                      <MdFormatListBulletedAdd
                        size={20}
                        className="text-white cursor-pointer"
                        onClick={() => setOpenList(!openList)}
                      />
                      {openList ? (
                        <div className={`${openList && "tooltiptext"}`}>
                          <div className="flex flex-col items-center">
                            <Link
                              href="/lists/create"
                              className="flex items-center justify-center py-1"
                            >
                              <IoIosAddCircle
                                size={25}
                                className="text-white"
                              />
                              <span className="pl-3">Create New List</span>
                            </Link>
                            <span className="pl-3 oveflow-hidden">
                              Add {tv?.title || tv?.name} to one of your list
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="tooltiptext">Add to list</span>
                      )}
                    </div>
                    {existedFavorite ? (
                      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
                        <MdOutlineFavorite
                          size={20}
                          className="text-pink-500 cursor-pointer"
                          onClick={onDeleteFavorite}
                        />
                        <span className="tooltiptext">Mark as favorite</span>
                      </div>
                    ) : (
                      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
                        <MdOutlineFavorite
                          size={20}
                          className="text-slate-200 cursor-pointer"
                          onClick={onFavorite}
                        />
                        <span className="tooltiptext">Mark as favorite</span>
                      </div>
                    )}
                    {existedWatchlist ? (
                      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
                        <MdBookmarkAdd
                          size={20}
                          className="text-red-500 cursor-pointer"
                          onClick={onDelete}
                        />
                        <span className="tooltiptext">
                          Remove from your watchlist
                        </span>
                      </div>
                    ) : (
                      <div className="tooltip p-2 mr-5 rounded-full bg-cyan-600">
                        <MdBookmarkAdd
                          size={20}
                          className="text-white cursor-pointer"
                          onClick={onSubmit}
                        />
                        <span className="tooltiptext">
                          Add to your watchlist
                        </span>
                      </div>
                    )}
                    {/* Play Trailer Button  */}
                    <PlayTrailerBtn trailer={trailer} textColor={textColor} />
                  </div>
                  <p
                    className="font-bold mb-3 text-2xl mt-3"
                    style={{ color: textColor }}
                  >
                    Overview:
                  </p>
                  <p
                    className="text-md text-white mb-3"
                    style={{ color: textColor }}
                  >
                    {detail?.synopsis
                      ? detail?.synopsis
                      : tv?.overview !== ""
                      ? tv?.overview
                      : `${tv?.name} has no overview yet!`}{" "}
                    <span>
                      <Link
                        href={`/tv/${tv?.id}/edit/detail`}
                        className="text-sm text-[#2490da] break-words"
                      >
                        Edit Translation
                      </Link>
                    </span>
                  </p>
                  <div className="border-t-[1px] pt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Navtive Title:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {detail?.native_title
                          ? detail?.native_title
                          : tv?.original_name?.length > 0
                          ? tv?.original_name
                          : "Native title is not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Also Known As:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {detail?.known_as?.length > 0
                          ? detail?.known_as?.map((known, idx) => (
                              <span key={idx}>
                                {idx > 0 && ", "}
                                {known}
                              </span>
                            ))
                          : title?.results?.length > 0
                          ? title?.results?.map((title: any, index: number) => (
                              <span key={index}>
                                {index > 0 && ", "}
                                {title?.title}
                              </span>
                            ))
                          : "Not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Director:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {getDrama?.crew?.length > 0
                          ? getDrama?.crew?.find(
                              (crew: any) => crew?.department === "Directing"
                            )?.name
                          : director?.name?.length > 0
                          ? director?.name
                          : "Director is not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Screenwriter:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {getDrama?.crew?.length > 0
                          ? getDrama?.crew?.find(
                              (crew: any) =>
                                crew?.jobs &&
                                crew?.jobs[0]?.job === "Screenstory"
                            )?.name
                          : screenwriter?.name?.length > 0
                          ? screenwriter?.name
                          : "Screenwirter is not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Genres:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {getDrama?.genres_tags?.length > 0
                          ? getDrama?.genres_tags
                              ?.map(
                                (tag: any) =>
                                  tag?.genre
                                    ?.map((gen: any, idx: number) => gen?.name)
                                    .join(", ") // Join genres with commas
                              )
                              .join(", ")
                          : tv?.genres?.length > 0
                          ? tv?.genres?.map((genre: any, index: number) => {
                              return index === genres.length - 1
                                ? genre.name
                                : genre.name + ", ";
                            })
                          : "Genres not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="mt-4">
                    <h1
                      className="text-white font-bold text-md"
                      style={{ color: textColor }}
                    >
                      Tags:
                      <span
                        className="text-sm pl-2 font-semibold text-[#1675b6]"
                        style={{ color: textColor }}
                      >
                        {getDrama?.genres_tags?.length > 0
                          ? formattedKeywordsDB
                          : formattedKeywords?.length > 0
                          ? formattedKeywords
                          : "Tags is not yet added!"}
                      </span>
                    </h1>
                  </div>
                  <div className="md:hidden">
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Country:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {detail?.title || matchedLanguage?.english_name}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Episode:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {info?.number_of_episodes
                            ? info?.number_of_episodes
                            : tv?.number_of_episodes}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Aired:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {getDrama?.released_information?.length > 0
                            ? formattedLastAirDate
                              ? `${formattedFirstAirDateDB} - ${formattedLastAirDateDB}`
                              : formattedFirstAirDateDB
                            : formattedLastAirDateDB
                            ? `${formattedFirstAirDate} - ${formattedLastAirDate}`
                            : formattedFirstAirDate}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Airs On:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {info?.broadcast
                            ?.map((broad) => broad?.day)
                            ?.join(", ")}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Original Network:{" "}
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {tv?.networks
                            ?.map((network: DramaReleasedInfo) => network?.name)
                            ?.join(", ")}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Duration:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {getDrama?.details?.length > 0
                            ? `${detail?.duration} min.`
                            : tv?.episode_run_time?.length > 0
                            ? `${tv?.episode_run_time[0]} min.`
                            : "Duration not yet added"}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Content Rating:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {getDrama?.details?.length > 0
                            ? detail?.content_rating
                            : `${
                                content?.results?.length === 0
                                  ? "Not Yet Rated"
                                  : content?.results[0]?.rating
                              }
                          ${
                            content?.results?.length !== 0 && (
                              <span>
                                + - Teens {content?.results[0]?.rating} or older
                              </span>
                            )
                          }`}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Status:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {getDrama?.details?.length > 0
                            ? detail?.status
                            : tv?.status === "Returning Series"
                            ? "Ongoing"
                            : tv?.status}
                        </span>
                      </h1>
                    </div>

                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Score:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {tv?.vote_average?.toFixed(1)}{" "}
                          {tv?.vote_average === 0
                            ? ""
                            : `(scored by ${tv?.vote_count} ${
                                tv?.vote_count < 2 ? " user" : " users"
                              })`}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Ranked:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          #{!rank ? "10000+" : rank}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Popularity:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          #{tv?.popularity}
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cast */}
      </div>
      <div>
        <DramaCast
          getDrama={getDrama}
          cast={cast}
          tv={tv}
          content={content}
          language={language}
          allTvShows={allTvShows}
          review={review}
          tv_id={tv_id}
          image={image}
          video={video}
          recommend={recommend}
          user={user}
          users={users}
          getComment={getComment}
          getReview={getReview}
        />
      </div>
    </>
  );
};

export default DramaMain;
