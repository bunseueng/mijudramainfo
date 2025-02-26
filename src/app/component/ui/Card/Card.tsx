"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useQuery } from "@tanstack/react-query";
import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import { StyledRating } from "@/app/actions/StyleRating";
import dynamic from "next/dynamic";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { fetchRatings, fetchTv } from "@/app/actions/fetchMovieApi";
import { DramaDetails, DramaReleasedInfo } from "@/helper/type";
const LazyImage = dynamic(() => import("@/components/ui/lazyimage"), {
  ssr: false,
});

export default function Card({
  result,
  BASE_URL,
  getDrama,
  getMovie,
  results,
}: any) {
  const drama = getDrama?.find((d: any) => d?.tv_id?.includes(result.id));
  const movie = getMovie?.find((d: any) => d?.movie_id?.includes(result.id));
  const [info]: DramaReleasedInfo[] = (drama?.released_information ||
    []) as unknown as DramaReleasedInfo[];
  const [detail]: DramaDetails[] = (drama?.details ||
    []) as unknown as DramaDetails[];
  const pathname = usePathname();
  const result_id = result?.id;
  const tvIds = results
    ?.filter((item: any) => item.media_type === "tv")
    .map((data: any) => data.id.toString());
  const tv_ids = results?.map((data: any) => data.id);

  const { data: tmdb_drama } = useQuery({
    queryKey: ["tmdb_drama", tvIds],
    queryFn: () => fetchTv(tvIds),
    staleTime: 3600000,
    enabled: Boolean(tvIds?.length),
  });

  const { data: tvRating } = useQuery({
    queryKey: ["tvRating", tv_ids],
    queryFn: () => fetchRatings(tv_ids),
    staleTime: 3600000,
    enabled: Boolean(tv_ids?.length),
  });

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

    // Get query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const queryType = searchParams.get("type");
    const queryCountry = searchParams.get("country");

    // If we have query parameters, prioritize them
    if (queryType || queryCountry) {
      const countryPrefix =
        {
          CN: "Chinese",
          KR: "Korean",
          JP: "Japanese",
          HK: "Hong Kong",
          TW: "Taiwanese",
          TH: "Thai",
        }[queryCountry || ""] || "";

      if (queryType === "movie")
        return countryPrefix ? `${countryPrefix} Movie` : "Movie";
      if (queryType === "tv")
        return countryPrefix ? `${countryPrefix} Drama` : "Drama";
      if (queryType === "tvShows")
        return countryPrefix ? `${countryPrefix} TV Show` : "TV Show";

      // If only country is specified
      if (queryCountry && !queryType) {
        if (genre_ids.includes(16)) return "Anime";
        if (genre_ids.includes(10764)) return `${countryPrefix} TV Show`;
        return `${countryPrefix} Drama`;
      }
    }

    // If no query parameters, fall back to original logic
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

  // Find the current drama's details safely
  const currentDrama = tmdb_drama?.find((data: any) => data.id === result_id);
  const currentDramaRating = tvRating?.find((data: any) =>
    data.tvId.includes(result_id)
  );
  const rating = currentDramaRating?.rating;
  const number_of_episodes = currentDrama?.number_of_episodes;

  return (
    <div className="p-5 relative box-border h-[90%]">
      <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
        <div className="relative">
          <Link
            prefetch={false}
            href={constructedHref}
            className="block box-content"
          >
            <LazyImage
              coverFromDB={drama?.cover || movie?.cover}
              src={
                result?.poster_path || result.backdrop_path !== null
                  ? `https://image.tmdb.org/t/p/w780/${
                      result.poster_path || result.backdrop_path
                    }`
                  : "/placeholder-image.avif"
              }
              alt={
                result?.name ||
                result?.title ||
                drama?.title ||
                movie?.title ||
                "Drama/Movie Poster"
              }
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
            prefetch={false}
            href={constructedHref}
            className="text-md text-sky-700 dark:text-[#2196f3] font-bold truncate"
          >
            {detail?.title || detail?.title || result?.title || result?.name}
          </Link>
        </div>

        <p className="flex flex-wrap items-center text-sm opacity-70 py-1">
          {getMediaType(result)}
          <span className="px-2 opacity-70">-</span>
          {info ? (
            <span className="font-semibold truncate opacity-70">
              {info?.air_date}
            </span>
          ) : (
            <span className="font-semibold truncate opacity-70">
              {!result?.first_air_date && !result?.release_date ? (
                <span>TBA</span>
              ) : (
                result?.first_air_date || result?.release_date
              )}
            </span>
          )}
          {detail?.episode ? (
            <span>
              <>, {detail?.episode} Episodes</>
            </span>
          ) : number_of_episodes ? (
            <span>
              <>, {number_of_episodes} Episodes</>
            </span>
          ) : (
            ""
          )}
        </p>

        <div className="flex items-center">
          <StyledRating
            name="customized-color"
            value={convertToFiveStars(
              result && result.vote_average && rating
                ? (result.vote_average * result.vote_count + rating * rating) /
                    (result.vote_count + rating)
                : rating
                ? rating
                : result && result.vote_average,
              10
            )}
            readOnly
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            precision={0.5}
          />
          <p className="pl-2 pt-1">
            {result && result.vote_average && rating
              ? (
                  (result.vote_average * result.vote_count + rating * rating) /
                  (result.vote_count + rating)
                ).toFixed(1) // Apply toFixed(1) to the entire expression
              : rating
              ? rating.toFixed(1)
              : result && result.vote_average.toFixed(1)}
          </p>
        </div>

        {result?.overview === "" ? (
          <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {detail?.title || result?.title || result?.name} does not have
            overview yet!
          </p>
        ) : (
          <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
            {detail?.synopsis || result?.overview}
          </p>
        )}
      </div>
    </div>
  );
}
