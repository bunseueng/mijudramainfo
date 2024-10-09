"use client";

import { fetchEpisodeCount } from "@/app/actions/fetchMovieApi";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import { StyledRating } from "@/app/actions/StyleRating";
import dynamic from "next/dynamic";
const ReusedImage = dynamic(() => import("@/components/ui/allreusedimage"), {
  ssr: false,
});

export default function Card({ result, BASE_URL, getDrama, getMovie }: any) {
  const [tvRating, setTvRating] = useState<any>();
  const tvCover = getDrama?.find((d: any) => d?.tv_id?.includes(result.id));
  const movieCover = getMovie?.find((d: any) =>
    d?.movie_id?.includes(result.id)
  );

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
  }, [result?.id]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const result_id = result?.id;
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
    originCountries[0] === "CN" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isKoreanDrama =
    dramaType &&
    originCountries[0] === "KR" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isJapanDrama =
    dramaType &&
    originCountries[0] === "JP" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isHKDrama =
    dramaType &&
    originCountries[0] === "HK" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isTaiwanDrama =
    dramaType &&
    originCountries[0] === "TW" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isThaiDrama =
    dramaType &&
    originCountries[0] === "TH" &&
    episode &&
    !genreIds?.includes(16) &&
    !genreIds?.includes(10764);
  const isChineseMovie = movieType && originCountries[0] === "CN" && !episode;
  const isKoreanMovie = movieType && originCountries[0] === "KR" && !episode;
  const isJapanMovie = movieType && originCountries[0] === "JP" && !episode;
  const isHKMovie = movieType && originCountries[0] === "HK" && !episode;
  const isTaiwanMovie = movieType && originCountries[0] === "TW" && !episode;
  const isThaiMovie = movieType && originCountries[0] === "TH" && !episode;
  const isChineseShow = genreIds.includes(10764) && originCountries[0] === "CN";
  const isKoreanShow = genreIds.includes(10764) && originCountries[0] === "KR";
  const isJapanShow = genreIds.includes(10764) && originCountries[0] === "JP";

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
          <Link
            prefetch={true}
            href={constructedHref}
            className="block box-content"
          >
            <ReusedImage
              src={
                movieCover || tvCover
                  ? movieCover?.cover || tvCover?.cover
                  : result?.poster_path !== null
                  ? `https://image.tmdb.org/t/p/w780/${
                      result.poster_path || result.backdrop_path
                    }`
                  : "/placeholder-image.avif"
              }
              alt={result?.name || result?.title}
              width={200}
              height={200}
              style={{ width: "100%", height: "100%" }}
              loading="lazy"
              className="w-full object-cover align-middle overflow-clip"
            />
          </Link>
        </div>
      </div>

      <div className="float-left w-[75%] md:w-[80%] px-3 align-top table-cell pl-1 md:pl-2">
        <div className="flex items-center justify-between">
          <Link
            href={constructedHref}
            className="text-md text-sky-700 dark:text-[#2196f3] font-bold truncate"
          >
            {result?.title || result?.name}
          </Link>
          {/* <p>#{idx + 1}</p> */}
        </div>
        <p className="flex flex-wrap items-center text-sm opacity-70 py-1">
          {isChineseShow && "Chinese Tv Show"}
          {isKoreanShow && "Korean Tv Show"}
          {isJapanShow && "Japanese Tv Show"}
          {isChineseDrama && "Chinese Drama"}
          {isKoreanDrama && "Korean Drama"}
          {isJapanDrama && "Japanese Drama"}
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
          {country === "KR" &&
          !genreIds.includes(16) &&
          !genreIds.includes(10764)
            ? "Korean Drama"
            : ""}
          {country === "JP" &&
          !genreIds.includes(16) &&
          !genreIds.includes(10764)
            ? "Japanese Drama"
            : ""}
          {country === "HK" &&
          !genreIds.includes(16) &&
          !genreIds.includes(10764)
            ? "Hongkong Drama"
            : ""}
          {country === "TW" &&
          !genreIds.includes(16) &&
          !genreIds.includes(10764)
            ? "Taiwanese Drama"
            : ""}
          {country === "TH" &&
          !genreIds.includes(16) &&
          !genreIds.includes(10764)
            ? "Thai Drama"
            : ""}
          {type === "movie" && country === "CN" ? "Chinese Movie" : ""}
          {type === "movie" && country === "JP" ? "Japanese Movie" : ""}
          {type === "movie" && country === "KR" ? "Korean Movie" : ""}
          {type === "movie" && country === "TW" ? "Taiwan Movie" : ""}
          {type === "movie" && country === "HK" ? "Hong Kong Movie" : ""}
          {type === "movie" && country === "TH" ? "Thai Movie" : ""}
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
            ? "Taiwanese Movie"
            : ""}
          {pathname === "/search/movie" &&
          result.original_language === "yue" &&
          !genreIds.includes(16)
            ? "Hong Kong Movie"
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
          originCountries[0] === "CN" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10764)
            ? "Chinese Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries[0] === "JP" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Japanese Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries[0] === "KR" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Korean Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries[0] === "TW" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Taiwan Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries[0] === "HK" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Hong Kong Drama"
            : ""}
          {pathname === "/search/tv" &&
          originCountries[0] === "TH" &&
          !genreIds?.includes(10764) &&
          !genreIds?.includes(16) &&
          !genreIds?.includes(10767)
            ? "Thai Drama"
            : ""}
          {genreIds.includes(16) && "Anime"}
          {pathname === "/search/network" &&
            (originCountries[0] === "CN" ||
              result?.original_language === "zh") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Chinese Drama"}
          {pathname === "/search/network" &&
            (originCountries[0] === "HK" ||
              result?.original_language === "cn") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Hong Kong Drama"}
          {pathname === "/search/network" &&
            (originCountries[0] === "KR" ||
              result?.original_language === "ko") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Korean Drama"}
          {pathname === "/search/network" &&
            (originCountries[0] === "JP" ||
              result?.original_language === "ja") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Japanese Drama"}
          {pathname === "/search/network" &&
            (originCountries[0] === "TW" ||
              result?.original_language === "TW") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Taiwanese Drama"}
          {pathname === "/search/network" &&
            (originCountries[0] === "TH" ||
              result?.original_language === "th") &&
            !genreIds.includes(16) &&
            !genreIds.includes(10764) &&
            "Thai Drama"}
          <span
            className={`px-2 opacity-70 ${
              result?.first_air_date === "" || result?.release_date === ""
                ? "hidden"
                : "block"
            }`}
          >
            -
          </span>
          <span className="font-semibold truncate opacity-70">
            {result?.first_air_date === "" || result?.release_date === "" ? (
              <span className="pl-2">- TBA</span>
            ) : (
              result?.first_air_date || result?.release_date
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
          <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {result?.title || result?.name} does not have overview yet!
          </p>
        ) : (
          <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {result?.overview}
          </p>
        )}
      </div>
    </div>
  );
}
