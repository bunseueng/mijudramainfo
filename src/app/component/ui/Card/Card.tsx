"use client";

import { fetchEpisodeCount } from "@/app/actions/fetchMovieApi";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import { StyledRating } from "@/app/actions/StyleRating";

export default function Card({ result, BASE_URL }: any) {
  const [tvRating, setTvRating] = useState<any>();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const getRatings = await fetch(`/api/rating/${result?.id}`);
        const data = await getRatings.json();
        const ratings = data?.ratings || [];
        // Filter ratings by tvId
        const filteredRatings = ratings.filter(
          (rating: any) => rating.tvId === result?.id.toString()
        );
        // Sum up all the ratings
        const sumOfRatings = filteredRatings.reduce(
          (sum: number, rating: any) => sum + rating.rating,
          0
        );
        // Get the number of ratings
        const numberOfRatings = filteredRatings.length;
        // Calculate the average rating
        const averageRating =
          numberOfRatings > 0 ? sumOfRatings / numberOfRatings : 0;
        setTvRating(averageRating);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };
    fetchRating();
  }, [result.id]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const result_id = result?.id;
  const query = searchParams?.get("query") ?? "";
  const type = searchParams?.get("type") ?? "";
  const country = searchParams?.get("country") ?? "";
  const { data: episode, isError } = useQuery({
    queryKey: ["episodes", result_id],
    queryFn: () => fetchEpisodeCount(result_id),
  });
  const path = BASE_URL.split("/").pop();
  const parts = BASE_URL.split("/");
  const searchTerm = parts[5]; // Assuming the "movie" part is at index 5
  const movieType = result?.media_type === "movie";
  // Assuming genre_ids and origin_country are arrays
  const genreIds = result?.genre_ids || [];
  const originCountries = result?.origin_country || [];
  const dramaType = result?.media_type === "tv";
  // Check if genreIds include 10764 and originCountries include "CN"
  const isChineseDrama =
    dramaType &&
    originCountries.includes("CN") &&
    episode &&
    !genreIds?.includes(16);
  const isKoreanDrama =
    dramaType &&
    originCountries.includes("KR") &&
    episode &&
    !genreIds?.includes(16);
  const isJapanDrama =
    dramaType &&
    originCountries.includes("JP") &&
    episode &&
    !genreIds?.includes(16);
  const isHKDrama =
    dramaType &&
    originCountries.includes("HK") &&
    episode &&
    !genreIds?.includes(16);
  const isTaiwanDrama =
    dramaType &&
    originCountries.includes("TW") &&
    episode &&
    !genreIds?.includes(16);
  const isThaiDrama =
    dramaType &&
    originCountries.includes("TH") &&
    episode &&
    !genreIds?.includes(16);
  const isChineseMovie =
    movieType && originCountries.includes("CN") && !episode;
  const isKoreanMovie = movieType && originCountries.includes("KR") && !episode;
  const isJapanMovie = movieType && originCountries.includes("JP") && !episode;
  const isHKMovie = movieType && originCountries.includes("HK") && !episode;
  const isTaiwanMovie = movieType && originCountries.includes("TW") && !episode;
  const isThaiMovie = movieType && originCountries.includes("TH") && !episode;
  const isChineseShow =
    genreIds.includes(10764) && originCountries.includes("CN");
  const isKoreanShow =
    genreIds.includes(10764) && originCountries.includes("KR");
  const isJapanShow =
    genreIds.includes(10764) && originCountries.includes("JP");

  const constructedHref = `/${
    pathname === `/search/${path}` && !movieType && result?.media_type
      ? path
      : result?.media_type || searchTerm
  }/${result?.id}`;

  if (isError) {
    console.log("Failed to fetch");
  }

  return (
    <div className="p-5 relative box-border h-[90%]">
      <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
        <div className="relative">
          <Link href={constructedHref} className="block box-content">
            {result?.poster_path || result?.backdrop_path !== null ? (
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  result.poster_path || result.backdrop_path
                }`}
                alt="drama image"
                width={200}
                height={200}
                style={{ width: "100%", height: "100%" }}
                priority
                className="w-full object-cover align-middle overflow-clip"
              />
            ) : (
              <Image
                src="/empty-img.jpg"
                alt="drama image"
                width={200}
                height={200}
                style={{ width: "100%", height: "100%" }}
                priority
                className="w-full h-full align-middle overflow-clip"
              />
            )}
          </Link>
        </div>
      </div>

      <div className="float-left w-[75%] md:w-[80%] px-3 align-top table-cell pl-1 md:pl-2">
        <div className="flex items-center justify-between">
          <Link
            href={constructedHref}
            className="text-xl text-sky-700 dark:text-[#2196f3] font-bold truncate"
          >
            {result?.title || result?.name}
          </Link>
          {/* <p>#{idx + 1}</p> */}
        </div>
        <p className="flex flex-wrap items-center py-1 opacity-70">
          {isChineseShow && "Chinese Tv Show"}
          {isKoreanShow && "Korean Tv Show"}
          {isJapanShow && "Japan Tv Show"}
          {isChineseDrama && "Chinese Drama"}
          {isKoreanDrama && "Korean Drama"}
          {isJapanDrama && "Japan Drama"}
          {isHKDrama && "Hongkong Drama"}
          {isTaiwanDrama && "Taiwanese Drama"}
          {isThaiDrama && "Thai Drama"}
          {isChineseMovie && "Chinese Movie"}
          {isKoreanMovie && "Korean Movie"}
          {isJapanMovie && "Japanese Movie"}
          {isHKMovie && "Hongkong Movie"}
          {isTaiwanMovie && "Taiwanese Movie"}
          {isThaiMovie && "Thai Movie"}
          {movieType && !genreIds.includes(16) && "Movie"}
          {type === "movie" && !country ? "Movie" : ""}
          {type === "tv" && !country ? "Drama" : ""}
          {type === "tvShows" && !country ? "Tv Show" : ""}
          {country === "CN" && episode && !type ? "Chinese Drama" : ""}
          {country === "KR" && !genreIds.includes(16) ? "Korean Drama" : ""}
          {country === "JP" && !genreIds.includes(16) ? "Japanese Drama" : ""}
          {country === "HK" && !genreIds.includes(16) ? "Hongkong Drama" : ""}
          {country === "TW" && !genreIds.includes(16) ? "Taiwanese Drama" : ""}
          {country === "TH" && !genreIds.includes(16) ? "Thai Drama" : ""}
          {type === "movie" && country === "CN" ? "Chinese Movie" : ""}
          {type === "movie" && country === "JP" ? "Japanese Movie" : ""}
          {type === "movie" && country === "KR" ? "Korean Movie" : ""}
          {type === "movie" && country === "TW" ? "Taiwan Movie" : ""}
          {type === "movie" && country === "HK" ? "Hongkong Movie" : ""}
          {pathname === "/search/movie" &&
          result.original_language === "zh" &&
          !genreIds.includes(16)
            ? "Chinese Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language === "ja" &&
          !genreIds.includes(16)
            ? "Japanese Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language === "ko" &&
          !genreIds.includes(16)
            ? "Korean Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language === "zh-TW" &&
          !genreIds.includes(16)
            ? "Taiwan Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language === "yue" &&
          !genreIds.includes(16)
            ? "Hongkong Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language !== "ja" &&
          result.original_language !== "zh" &&
          result.original_language !== "zh-TW" &&
          result.original_language !== "ko" &&
          result.original_language !== "yue"
            ? "Movie"
            : ""}
          {pathname === "/search/tv" &&
          originCountries.includes("CN") &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10764)
            ? "Chinese Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries.includes("JP") &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Japanese Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries.includes("KR") &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Korean Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries.includes("TW") &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Taiwan Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries.includes("HK") &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Hongkong Drama"
            : ""}
          {genreIds.includes(16) && "Anime"}
          <span
            className={`px-2 opacity-70 ${
              result?.release_date === "" ? "hidden" : "block"
            }`}
          >
            -
          </span>
          <span className="font-semibold truncate opacity-70">
            {result?.first_air_date === "" ? (
              <span className="pl-2">- TBA</span>
            ) : (
              result?.first_air_date
            )}
            {result?.release_date === "" ? (
              <span className="pl-2">- TBA</span>
            ) : (
              result?.release_date
            )}
            <span className={`${!episode?.number_of_episodes && "hidden"}`}>
              ,
            </span>{" "}
            {episode?.number_of_episodes}{" "}
            {episode?.number_of_episodes && "Episodes"}
          </span>
        </p>
        <div className="flex items-center">
          <StyledRating
            name="customized-color"
            value={convertToFiveStars(
              result && result.vote_average && tvRating
                ? (result.vote_average * result.vote_count +
                    tvRating * tvRating) /
                    (result.vote_count + tvRating)
                : tvRating
                ? tvRating
                : result && result.vote_average,
              10
            )}
            readOnly
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            precision={0.5}
          />
          <p className="pl-2 pt-1">
            {result && result.vote_average && tvRating
              ? (
                  (result.vote_average * result.vote_count +
                    tvRating * tvRating) /
                  (result.vote_count + tvRating)
                ).toFixed(1)
              : tvRating
              ? tvRating.toFixed(1)
              : result && result.vote_average.toFixed(1)}
          </p>
        </div>

        {result?.overview === "" ? (
          <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {result?.title || result?.name} does not have overview yet!
          </p>
        ) : (
          <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {result?.overview}
          </p>
        )}
      </div>
    </div>
  );
}
