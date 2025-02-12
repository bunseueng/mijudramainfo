"use client";

import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import {
  fetchRatings,
  fetchMovie,
  fetchMovieGenre,
} from "@/app/actions/fetchMovieApi";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { StyledRating } from "@/app/actions/StyleRating";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { BiSort } from "react-icons/bi";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
import { countryFilter } from "@/helper/item-list";
import { useInView } from "react-intersection-observer";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
import AdBanner from "@/app/component/ui/Adsense/AdBanner";

const PlayTrailer = dynamic(
  () => import("@/app/(route)/(drama)/drama/top/PlayTrailer"),
  { ssr: false }
);

interface Genre {
  genre_id: string;
}

const DramaCard = ({ drama, tvDetail, ratings, overallIndex }: any) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  const ratingData = ratings?.[drama.id];
  const averageRating = ratingData?.ratings
    ? ratingData.ratings.reduce(
        (sum: number, rating: any) => sum + rating.rating,
        0
      ) / ratingData.ratings.length
    : 0;

  const combinedRating =
    drama.vote_average && averageRating
      ? (drama.vote_average + averageRating) / 2
      : drama.vote_average || averageRating || 0;

  return (
    <div
      ref={ref}
      className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
    >
      {inView ? (
        <>
          <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
            <div className="relative">
              <Link
                prefetch={false}
                href={`/tv/${drama?.id}-${spaceToHyphen(
                  drama?.name || drama?.title
                )}`}
              >
                {drama?.poster_path || drama?.backdrop_path ? (
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/${
                      drama?.poster_path ? "w154" : "w300"
                    }/${drama.poster_path || drama.backdrop_path}`}
                    alt={
                      `${drama?.name || drama?.title}'s Poster` ||
                      "Drama Poster"
                    }
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                    priority
                    className="w-full object-cover align-middle overflow-clip"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.avif"
                    alt={drama?.name || drama?.title || "Drama Poster"}
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
          <div className="pl-2 md:pl-3 w-[80%]">
            <div className="flex items-center justify-between">
              <Link
                prefetch={false}
                href={`/tv/${drama?.id}-${spaceToHyphen(
                  drama?.name || drama?.title
                )}`}
                className="text-lg text-sky-700 dark:text-[#2196f3] font-bold"
              >
                {drama?.name || drama?.title}
              </Link>
              <p>#{overallIndex}</p>
            </div>
            <p className="text-slate-400 py-1">
              {getDramaType(tvDetail)}
              <span>
                {" "}
                -{" "}
                {getYearFromDate(drama?.first_air_date || drama?.release_date)}
              </span>
            </p>
            <div className="flex items-center">
              <StyledRating
                name="customized-color"
                value={convertToFiveStars(combinedRating, 10)}
                readOnly
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                precision={0.5}
              />
              <p className="pl-2 pt-1">{combinedRating.toFixed(1)}</p>
            </div>
            <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
              {drama?.overview}
            </p>
            <div className="flex items-center">
              <Suspense fallback={<div>loading...</div>}>
                <PlayTrailer video={tvDetail?.videos} />
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[200px] animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  );
};

const MovieGenre: React.FC<Genre> = ({ genre_id }) => {
  const [sortby, setSortby] = useState<string>();
  const [type, setType] = useState<string>("28");
  const [country, setCountry] = useState<string>("CN");
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const per_page = Number.parseInt(searchParams?.get("per_page") || "20");

  // Update the component to use the TV details again
  const { data: genreDetails, isLoading: isKeywordLoading } = useQuery({
    queryKey: ["genre_details", currentPage, genre_id, sortby, country],
    queryFn: () => fetchMovieGenre(currentPage, genre_id, sortby, country),
    staleTime: 3600000,
    gcTime: 3600000,
  });

  const totalItems = genreDetails?.results?.slice(0, per_page) || [];
  const movie_id = totalItems.map((item: any) => item.id.toString());
  const { data: movieDetails, isLoading: isTvDetailsLoading } = useQuery({
    queryKey: ["movieDetails", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000,
    gcTime: 3600000,
    enabled: !!movie_id.length,
  });

  const { data: ratings, isLoading: isRatingsLoading } = useQuery({
    queryKey: ["ratings", movie_id],
    queryFn: () => fetchRatings(movie_id),
    staleTime: 3600000,
    gcTime: 3600000,
    enabled: !!movie_id.length,
  });

  if (isKeywordLoading) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-2 md:px-5">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isTvDetailsLoading || isRatingsLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <div className="relative w-full min-h-[200px]">
        <div className="absolute inset-0">
          <AdBanner dataAdFormat="auto" dataAdSlot="3527489220" />
        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3 order-1 md:order-2">
            <FilterSection
              type={type}
              setType={setType}
              country={country}
              setCountry={setCountry}
              sortby={sortby}
              setSortby={setSortby}
            />
          </div>
          <div className="w-full md:w-[70%] px-1 md:px-3 order-2 md:order-1">
            <div className="flex items-center justify-between mb-5">
              <p>{genreDetails?.total_results} results</p>
            </div>
            {totalItems?.map((movie: any, idx: number) => {
              const startCal = (currentPage - 1) * per_page;
              const overallIndex = startCal + idx + 1;
              const tvDetail = movieDetails?.find(
                (data: any) => data.id === movie.id
              );

              return (
                <DramaCard
                  key={movie?.id}
                  drama={movie}
                  tvDetail={tvDetail}
                  ratings={ratings}
                  overallIndex={overallIndex}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between px-1 md:px-2 mt-3">
        <SearchPagination
          setPage={setPage}
          totalItems={genreDetails?.total_results}
          per_page={per_page.toString()}
        />
      </div>
    </div>
  );
};

const FilterSection: React.FC<{
  type: string;
  setType: (type: string) => void;
  country: string;
  setCountry: (country: string) => void;
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}> = ({ type, setType, country, setCountry, sortby, setSortby }) => {
  return (
    <>
      <div className="hidden md:block relative w-full min-h-[200px] mb-10">
        <div className="absolute inset-0">
          <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
        </div>
      </div>
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <BiSort className="inline-block" />
          <span className="font-semibold">Sort By</span>
        </div>
        <select
          className="w-full border rounded-md p-2 text-sm"
          value={sortby}
          onChange={(e) => setSortby(e.target.value)}
        >
          <option value="">Select</option>
          <option value="popularity.desc">Popularity (High to Low)</option>
          <option value="popularity.asc">Popularity (Low to High)</option>
          <option value="vote_average.desc">Rating (High to Low)</option>
          <option value="vote_average.asc">Rating (Low to High)</option>
          <option value="release_date.desc">Newest First</option>
          <option value="release_date.asc">Oldest First</option>
        </select>
      </div>
      <div className="md:hidden mb-4">
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mb-2">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="28">Movie</option>
            </select>
          </div>
          <div className="w-1/2 px-2 mb-2">
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countryFilter?.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="inline-block">
          <BiSort className="inline-block" />{" "}
          <span className="align-middle">Sort By</span>
        </div>
        <div className="mt-4">
          <div className="border-b border-b-slate-400">Type:</div>
          <div className="relative float-left w-full text-left mb-4 my-5">
            <div className="-mx-3">
              <div className="relative float-left w-full px-3">
                <label
                  className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                    type === "28" ? "text-[#409eff] font-bold" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="28"
                    value="28"
                    checked={type === "28"}
                    onChange={() => {
                      setType("28");
                    }}
                    className="transform duration-300 cursor-pointer mr-2"
                  />
                  <span>Movie</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="border-b border-b-slate-400">Country:</div>
          <div className="relative float-left w-full text-left mb-4 my-5">
            <div className="-mx-3">
              <div className="relative float-left w-full px-3">
                {countryFilter?.map((c, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                      country === c?.value ? "text-[#409eff] font-bold" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={c?.value}
                      value={c?.value}
                      checked={country === c?.value}
                      onChange={() => setCountry(c?.value)}
                      className="transform duration-300 cursor-pointer mr-2"
                    />
                    <span>{c?.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <SortOption
          title="Popularity"
          options={[
            { value: "popularity.asc", label: "Ascending" },
            { value: "popularity.desc", label: "Descending" },
          ]}
          sortby={sortby}
          setSortby={setSortby}
        />
        <SortOption
          title="Rating"
          options={[
            { value: "vote_average.asc", label: "Ascending" },
            { value: "vote_average.desc", label: "Descending" },
          ]}
          sortby={sortby}
          setSortby={setSortby}
        />
        <SortOption
          title="First Air Date"
          options={[
            { value: "first_air_date.asc", label: "Ascending" },
            { value: "first_air_date.desc", label: "Descending" },
          ]}
          sortby={sortby}
          setSortby={setSortby}
        />
      </div>{" "}
      <div className="relative w-full min-h-[200px] mt-24 hidden md:block">
        <div className="absolute inset-0">
          <AdArticle dataAdFormat="auto" dataAdSlot="4321696148" />
        </div>
      </div>
    </>
  );
};

const SortOption: React.FC<{
  title: string;
  options: { value: string; label: string }[];
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}> = ({ title, options, sortby, setSortby }) => {
  return (
    <div className="hidden md:block mt-5">
      <div className="border-b border-b-slate-400">{title}:</div>
      <div className="relative float-left w-full text-left mb-4 my-5">
        <div className="-mx-3">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`relative float-left w-full px-3 ${
                index > 0 ? "mt-2" : ""
              }`}
            >
              <label
                className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                  sortby === option.value ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name={option.value}
                  value={option.value}
                  checked={sortby === option.value}
                  onChange={() => setSortby(option.value)}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getDramaType = (movie: any) => {
  const { origin_country } = movie;
  const country = origin_country?.[0];

  switch (country) {
    case "CN":
      return "Chinese Movie";
    case "JP":
      return "Japanese Movie";
    case "KR":
      return "Korean Movie";
    case "TW":
      return "Taiwanese Movie";
    case "HK":
      return "Hong Kong Movie";
    case "TH":
      return "Thailand Movie";
    default:
      return "Movie";
  }
};

export default MovieGenre;
