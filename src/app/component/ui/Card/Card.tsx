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
import { spaceToHyphen } from "@/lib/spaceToHyphen";
const ReusedImage = dynamic(() => import("@/components/ui/allreusedimage"), {
  ssr: false,
});

export default function Card({ result, BASE_URL, getDrama, getMovie }: any) {
  const [tvRating, setTvRating] = useState<any>();
  const tvCover = getDrama?.find((d: any) => d?.tv_id?.includes(result.id));
  const movieCover = getMovie?.find((d: any) =>
    d?.movie_id?.includes(result.id)
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const result_id = result?.id;

  const { data: episode, isError } = useQuery({
    queryKey: ["episodes", result_id],
    queryFn: () => fetchEpisodeCount(result_id),
  });

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const getRatings = await fetch(`/api/rating/${result?.id}`);
        const data = await getRatings.json();
        const ratings = data?.ratings || [];
        const filteredRatings = ratings.filter(
          (rating: any) => rating.tvId === result?.id.toString()
        );
        const sumOfRatings = filteredRatings.reduce(
          (sum: number, rating: any) => sum + rating.rating,
          0
        );
        const numberOfRatings = filteredRatings.length;
        const averageRating =
          numberOfRatings > 0 ? sumOfRatings / numberOfRatings : 0;
        setTvRating(averageRating);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };
    fetchRating();
  }, [result?.id]);

  const path = BASE_URL.split("/").pop();
  const parts = BASE_URL.split("/");
  const searchTerm = parts[5];

  const constructedHref = `/${
    pathname === `/search/${path}` && result?.media_type !== "movie"
      ? path
      : result?.media_type || searchTerm
  }/${result?.id}-${spaceToHyphen(result?.title || result?.name)}`;

  const getMediaType = (result: any) => {
    const {
      media_type,
      genre_ids = [],
      origin_country = [],
      original_language,
    } = result;
    const isDrama =
      media_type === "tv" &&
      !genre_ids.includes(16) &&
      !genre_ids.includes(10764);
    const isMovie = media_type === "movie" && !genre_ids.includes(16);
    const isAnime = genre_ids.includes(16);
    const isShow = genre_ids.includes(10764);

    const countryMap: { [key: string]: string } = {
      CN: "Chinese",
      KR: "Korean",
      JP: "Japanese",
      HK: "Hong Kong",
      TW: "Taiwanese",
      TH: "Thai",
    };

    let country = origin_country[0];
    if (!country) {
      const langToCountry: { [key: string]: string } = {
        zh: "CN",
        ko: "KR",
        ja: "JP",
        "zh-TW": "TW",
        yue: "HK",
        th: "TH",
      };
      country = langToCountry[original_language];
    }

    if (isAnime) return "Anime";

    const countryPrefix = countryMap[country] || "";
    if (isDrama) return countryPrefix ? `${countryPrefix} Drama` : "Drama";
    if (isMovie) return countryPrefix ? `${countryPrefix} Movie` : "Movie";
    if (isShow) return countryPrefix ? `${countryPrefix} TV Show` : "TV Show";

    return "Other";
  };

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
                  : result?.poster_path || result.backdrop_path !== null
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
              className={`w-full object-cover align-middle overflow-clip ${
                result?.poster_path === null && "h-[155px] md:h-[175px]"
              }`}
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
        </div>

        <p className="flex flex-wrap items-center text-sm opacity-70 py-1">
          {getMediaType(result)}
          <span
            className={`px-2 opacity-70 ${
              !result?.first_air_date && !result?.release_date
                ? "hidden"
                : "block"
            }`}
          >
            -
          </span>
          <span className="font-semibold truncate opacity-70">
            {!result?.first_air_date && !result?.release_date ? (
              <span className="pl-2">TBA</span>
            ) : (
              result?.first_air_date || result?.release_date
            )}
            {episode?.number_of_episodes && (
              <>, {episode.number_of_episodes} Episodes</>
            )}
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
