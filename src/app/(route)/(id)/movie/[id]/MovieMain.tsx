"use client";

import {
  MdBookmarkAdd,
  MdFormatListBulletedAdd,
  MdOutlineFavorite,
} from "react-icons/md";
import {
  fetchLanguages,
  fetchMovie,
  fetchMovieCastCredit,
  fetchMovieImages,
  fetchMovieKeyword,
  fetchMovieRecommendation,
  fetchMovieReview,
  fetchMovieTitle,
  fetchMovieTrailer,
  fetchMovieVideos,
  fetchRecommendation,
} from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import MovieCast from "./MovieCast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getTextColor } from "@/app/actions/getTextColor";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Image from "next/image";
import { formatDate } from "@/app/actions/formatDate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { DramaDetails, DramaReleasedInfo } from "@/helper/type";
import RatingModal from "@/app/component/ui/CircleRating/RatingModal";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import PlayMovieTrailer from "@/app/(route)/(drama)/movie/top/PlayMovieTrailer";
import { formatDuration } from "@/app/actions/formattedDuration";
import MovieList from "./MovieList";
const CircleRating = dynamic(
  () => import("@/app/component/ui/CircleRating/CircleRating"),
  { ssr: false }
);

const MovieMain = ({
  movie_id,
  getMovie,
  user,
  users,
  getComment,
  lists,
  existedFavorite,
  existedWatchlist,
  existingRatings,
  getReview,
  userRating,
  getMovieFromDB,
}: any) => {
  const [openList, setOpenList] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [certification, setCertification] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [textColor, setTextColor] = useState("#FFFFFF"); // Default to white text
  const router = useRouter();
  const { data: movie } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: trailer } = useQuery({
    queryKey: ["movieTrailer", movie_id],
    queryFn: () => fetchMovieTrailer(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: cast } = useQuery({
    queryKey: ["movieCast", movie_id],
    queryFn: () => fetchMovieCastCredit(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: language } = useQuery({
    queryKey: ["movieLanguage", movie_id],
    queryFn: () => fetchLanguages(),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: keyword } = useQuery({
    queryKey: ["movieKeyword", movie_id],
    queryFn: () => fetchMovieKeyword(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: title } = useQuery({
    queryKey: ["movieTitle", movie_id],
    queryFn: () => fetchMovieTitle(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: review } = useQuery({
    queryKey: ["movieReview", movie_id],
    queryFn: () => fetchMovieReview(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: image } = useQuery({
    queryKey: ["movieImage", movie_id],
    queryFn: () => fetchMovieImages(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: video } = useQuery({
    queryKey: ["movieVideo", movie_id],
    queryFn: () => fetchMovieVideos(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: recommend } = useQuery({
    queryKey: ["movieRecommend", movie_id],
    queryFn: () => fetchMovieRecommendation(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: allmovieShows } = useQuery({
    queryKey: ["allmovieShows"],
    queryFn: fetchRecommendation,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  // Getting Crew
  const castCredit = cast?.crew?.map((item: any) => item);
  const director = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Directing"
  );
  const screenwriter = castCredit?.find(
    (cast: any) => cast?.known_for_department === "Creator"
  );
  const original_country = movie?.origin_country?.[0];
  const keywords = keyword?.keywords;
  const matchedLanguage = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );
  const allTvShowsArray = Array.isArray(allmovieShows) ? allmovieShows : [];
  // Find the index of the matched TV show in allTvShows array
  const matchedIndex = allTvShowsArray.findIndex(
    (show: any) => show.id === movie.id
  );
  // Calculate the rank by adding 1 to the index
  const rank = matchedIndex !== -1 ? matchedIndex + 1 : null;
  const formattedKeywords = keywords?.map((key: any, index: number) => {
    const capitalizedKeyword =
      key.name.charAt(0).toUpperCase() + key.name.slice(1);
    return index === keywords?.length - 1
      ? capitalizedKeyword
      : capitalizedKeyword + ", ";
  });
  const formattedKeywordsDB = getMovie?.genres_tags[0]?.tag
    ?.map((key: any, index: number) => {
      const capitalizedKeyword =
        key.name.charAt(0).toUpperCase() + key.name.slice(1);
      return index === getMovie.genres_tags[0].tag.length - 1
        ? capitalizedKeyword
        : capitalizedKeyword + ", ";
    })
    .join("");
  const genres = movie?.genres;

  const movieRating = existingRatings?.map((item: any) => item?.rating);
  const sumRating = movieRating?.reduce(
    (acc: any, rating: number) => acc + rating,
    0
  );
  const calculatedRating = sumRating / existingRatings?.length;

  const [detail]: DramaDetails[] = (getMovie?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (getMovie?.released_information ||
    []) as unknown as DramaReleasedInfo[];

  const formattedFirstAirDate = movie?.first_air_date
    ? formatDate(movie.first_air_date)
    : "TBA";
  const formattedLastAirDate = movie?.last_air_date
    ? formatDate(movie.last_air_date)
    : "";
  const formattedFirstAirDateDB = info?.release_date
    ? formatDate(info.release_date)
    : "TBA";
  const formattedLastAirDateDB = info?.end_date
    ? formatDate(info.end_date)
    : "";
  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/movie/${movie?.id}/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: movie?.id,
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
      const res = await fetch(`/api/watchlist/${movie?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: movie?.id,
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
      const res = await fetch(`/api/favorite/${movie?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: movie?.id,
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
      const res = await fetch(`/api/favorite/${movie?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: movie?.id,
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
      const colorString = await getColorFromImage(
        getMovie?.cover ||
          `https://image.tmdb.org/t/p/w500/${
            movie?.poster_path || movie?.backdrop_path
          }`
      );
      // Parse the RGB values from the string
      const regex = /rgb\((\d+), (\d+), (\d+)\)/;
      const match = colorString && colorString?.match(regex);

      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, 1)`; // Full opacity
        const gradientBackground = `linear-gradient(to right, ${rgbaColor}, rgba(${r}, ${g}, ${b}, 0.84) 50%, rgba(${r}, ${g}, ${b}, 0.84) 100%)`;
        setDominantColor(gradientBackground);
        const textColor = getTextColor(r, g, b);
        setTextColor(textColor);
      } else {
        console.error("Failed to parse color string:", colorString);
      }
    }
  }, [getMovie?.cover, movie?.backdrop_path, movie?.poster_path]);

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
        console.log("Movie releases or countries data not available");
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

  // Ensure the image element is referenced correctly
  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [movie, extractColor]);
  return (
    <section className="relative w-full z-50">
      <div className="w-full h-full">
        <MovieList movie_id={movie_id} />
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat h-auto"
          style={{
            backgroundPosition: "calc(50vw - 510px) top",
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${
              movie?.backdrop_path || movie?.poster_path
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
                    getMovie?.cover ||
                    `https://image.tmdb.org/t/p/w500/${
                      movie?.poster_path || movie?.backdrop_path
                    }`
                  }
                  alt={detail?.title || movie?.name}
                  width={300}
                  height={440}
                  quality={100}
                  priority
                  className="block align-middle !w-[300px] md:!min-w-[300px] !h-[440px] bg-cover object-cover rounded-lg md:pl-0"
                />

                <div className="md:pl-4 lg:pl-8 py-5">
                  <div className="relative">
                    <h2
                      className="text-3xl font-bold text-white"
                      style={{ color: textColor }}
                    >
                      <span className="cursor-pointer hover:opacity-50 duration-300">
                        {detail?.title || movie?.title || movie?.name}
                      </span>{" "}
                      (
                      {getYearFromDate(
                        movie?.first_air_date || movie?.release_date
                      )}
                      )
                    </h2>
                  </div>
                  <div className="mb-2 text-sm md:text-md font-bold text-white">
                    <span
                      className="cursor-pointer hover:opacity-50 duration-300"
                      style={{ color: textColor }}
                    >
                      {getMovie?.genres_tags?.length > 0
                        ? getMovie?.genres_tags
                            ?.map(
                              (tag: any) =>
                                tag?.genre
                                  ?.map((gen: any) => gen?.value)
                                  .join(", ") // Join genres with commas
                            )
                            .join(", ")
                        : movie?.genres?.length > 0
                        ? movie?.genres?.map((genre: any, index: number) => {
                            return index === genres.length - 1
                              ? genre.name
                              : genre.name + ", ";
                          })
                        : null}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center py-5">
                    <CircleRating
                      rating={
                        movie && movie.vote_average && calculatedRating
                          ? (
                              (movie.vote_average * movie.vote_count +
                                calculatedRating * calculatedRating) /
                              (movie.vote_count + calculatedRating)
                            ).toFixed(1)
                          : calculatedRating
                          ? calculatedRating.toFixed(1)
                          : movie && movie.vote_average
                          ? movie.vote_average.toFixed(1)
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
                      From {movie?.vote_count + existingRatings?.length}
                      {movie?.vote_count < 2 ? " user" : " users"}
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
                        id={movie_id}
                        user={user}
                        userRating={userRating}
                        movie={movie}
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
                              prefetch={true}
                            >
                              <IoIosAddCircle
                                size={25}
                                className="text-white"
                              />
                              <span className="pl-3">Create New List</span>
                            </Link>
                            <span className="pl-3 oveflow-hidden">
                              Add {movie?.title || movie?.name} to one of your
                              list
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
                    <PlayMovieTrailer trailer={trailer} textColor={textColor} />
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
                      : movie?.overview !== ""
                      ? movie?.overview
                      : `${movie?.name} has no overview yet!`}{" "}
                    <span>
                      <Link
                        href={`/movie/${movie?.id}/edit/detail`}
                        className="text-sm text-[#2490da] break-words"
                        shallow
                        prefetch={true}
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
                          : movie?.original_title?.length > 0
                          ? movie?.original_title
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
                          : title?.titles?.length > 0
                          ? title?.titles?.map((title: any, index: number) => (
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
                        {getMovie?.crew?.length > 0
                          ? getMovie?.crew?.find(
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
                        {getMovie?.crew?.length > 0
                          ? getMovie?.crew?.find(
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
                        {getMovie?.genres_tags?.length > 0
                          ? getMovie?.genres_tags
                              ?.map(
                                (tag: any) =>
                                  tag?.genre
                                    ?.map((gen: any) => gen?.value)
                                    .join(", ") // Join genres with commas
                              )
                              .join(", ")
                          : movie?.genres?.length > 0
                          ? movie?.genres?.map((genre: any, index: number) => {
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
                        {getMovie?.genres_tags?.length > 0
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
                        Aired:
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {getMovie?.released_information?.length > 0
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
                          {info?.broadcast?.length > 0
                            ? info?.broadcast
                                ?.map((broad) => broad?.day)
                                ?.join(", ")
                            : "?"}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Budget:{" "}
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(movie?.budget)}
                        </span>
                      </h1>
                    </div>
                    <div className="mt-4">
                      <h1
                        className="text-white font-bold text-md"
                        style={{ color: textColor }}
                      >
                        Revenue:{" "}
                        <span
                          className="text-sm pl-2 font-semibold text-[#1675b6]"
                          style={{ color: textColor }}
                        >
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(movie?.revenue)}
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
                          {movie?.runtime
                            ? formatDuration(movie?.runtime)
                            : "Duration not yet added."}
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
                          {certification === "N/A"
                            ? "Not Yet Rated"
                            : `${certification} or older`}
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
                          {getMovie?.details?.length > 0
                            ? detail?.status
                            : movie?.status === "Returning Series"
                            ? "Ongoing"
                            : movie?.status}
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
                          {movie?.vote_average?.toFixed(1)}{" "}
                          {movie?.vote_average === 0
                            ? ""
                            : `(scored by ${movie?.vote_count} ${
                                movie?.vote_count < 2 ? " user" : " users"
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
                          #{movie?.popularity}
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
        <MovieCast
          cast={cast}
          movie={movie}
          language={language}
          allmovieShows={allmovieShows}
          review={review}
          movie_id={movie_id}
          image={image}
          video={video}
          recommend={recommend}
          user={user}
          users={users}
          getComment={getComment}
          getMovie={getMovie}
          getReview={getReview}
          lists={lists}
          keyword={keyword}
          certification={certification}
        />
      </div>
    </section>
  );
};

export default MovieMain;
