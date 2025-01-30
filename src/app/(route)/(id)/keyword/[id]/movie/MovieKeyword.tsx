"use client";

import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import {
  fetchMovie,
  fetchMovieKeywords,
  fetchRatings,
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

const PlayMovieTrailer = dynamic(
  () => import("@/app/(route)/(id)/movie/[id]-[slug]/PlayMovieTrailer"),
  { ssr: false }
);

interface Network {
  keyword_id: string;
}

const MovieCard = ({ movie, ratings, overallIndex, movieDetail }: any) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const ratingData = ratings?.[movie.id];
  const averageRating = ratingData?.ratings
    ? ratingData.ratings.reduce(
        (sum: number, rating: any) => sum + rating.rating,
        0
      ) / ratingData.ratings.length
    : 0;

  const combinedRating =
    movie.vote_average && averageRating
      ? (movie.vote_average + averageRating) / 2
      : movie.vote_average || averageRating || 0;
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
                href={`/movie/${movie?.id}-${spaceToHyphen(
                  movie?.name || movie?.title
                )}`}
              >
                {movie?.poster_path || movie?.backdrop_path ? (
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/${
                      movie?.poster_path ? "w154" : "w300"
                    }/${movie.poster_path || movie.backdrop_path}`}
                    alt={`${movie?.title}'s Poster` || "Movie Poster"}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                    priority
                    className="w-full object-cover align-middle overflow-clip"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.avif"
                    alt={movie?.title || "Movie Poster"}
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
                href={`/movie/${movie?.id}-${spaceToHyphen(
                  movie?.name || movie?.title
                )}`}
                className="text-lg text-sky-700 dark:text-[#2196f3] font-bold"
              >
                {movie?.title}
              </Link>
              <p>#{overallIndex}</p>
            </div>
            <p className="text-slate-400 py-1">
              {getMovieType(movie)}
              <span> - {getYearFromDate(movie?.release_date)}</span>
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
              {movie?.overview}
            </p>
            <div className="flex items-center">
              <Suspense fallback={null}>
                <PlayMovieTrailer video={movieDetail?.videos?.results} />
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

const MovieKeyword: React.FC<Network> = ({ keyword_id }) => {
  const [sortby, setSortby] = useState<string>();
  const [genre, setGenre] = useState<string>("movie");
  const [country, setCountry] = useState<string>("");
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const [withoutGenre, setWithoutGenre] = useState<string>("");
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const per_page = Number.parseInt(searchParams?.get("per_page") || "20");

  // Update the component to use the TV details again
  const { data: keywordDetails, isLoading: isKeywordLoading } = useQuery({
    queryKey: [
      "movieKeywordDetails",
      currentPage,
      keyword_id,
      sortby,
      withoutGenre,
      country,
    ],
    queryFn: () =>
      fetchMovieKeywords(
        currentPage,
        keyword_id,
        sortby,
        withoutGenre,
        country
      ),
    staleTime: 3600000,
  });

  const totalItems = keywordDetails?.results?.slice(0, per_page) || [];
  const movieIds = totalItems.map((item: any) => item.id.toString());

  const { data: movieDetails, isLoading: isMovieDetailsLoading } = useQuery({
    queryKey: ["movieDetails", movieIds],
    queryFn: () => fetchMovie(movieIds),
    staleTime: 3600000,
    enabled: !!movieIds.length,
  });

  const { data: ratings, isLoading: isRatingsLoading } = useQuery({
    queryKey: ["ratings", movieIds],
    queryFn: () => fetchRatings(movieIds),
    staleTime: 3600000,
    enabled: !!movieIds.length,
  });

  if (isKeywordLoading || isRatingsLoading || isMovieDetailsLoading) {
    return <SearchLoading />;
  }
  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%] px-1 md:px-3">
            <div className="flex items-center justify-between mb-5">
              <p>{keywordDetails?.total_results} results</p>
            </div>
            {totalItems?.map((movie: any, idx: number) => {
              const startCal = (currentPage - 1) * per_page;
              const overallIndex = startCal + idx + 1;
              const movieDetail = movieDetails?.find(
                (data: any) => data.id === movie.id
              );

              return (
                <MovieCard
                  key={movie?.id}
                  movie={movie}
                  ratings={ratings}
                  overallIndex={overallIndex}
                  movieDetail={movieDetail}
                />
              );
            })}
          </div>

          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3">
            <FilterSection
              genre={genre}
              setGenre={setGenre}
              country={country}
              setCountry={setCountry}
              sortby={sortby}
              setSortby={setSortby}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between px-1 md:px-2 mt-3">
        <SearchPagination
          setPage={setPage}
          totalItems={keywordDetails?.total_results}
          per_page={per_page.toString()}
        />
      </div>
    </div>
  );
};

const FilterSection: React.FC<{
  genre: string;
  setGenre: (genre: string) => void;
  country: string;
  setCountry: (country: string) => void;
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}> = ({ genre, setGenre, country, setCountry, sortby, setSortby }) => {
  return (
    <>
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
                  genre === "movie" ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name="movie"
                  value="movie"
                  checked={genre === "movie"}
                  onChange={() => setGenre("movie")}
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
        title="Release Date"
        options={[
          { value: "release_date.asc", label: "Ascending" },
          { value: "release_date.desc", label: "Descending" },
        ]}
        sortby={sortby}
        setSortby={setSortby}
      />
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
    <div className="mt-5">
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

const getMovieType = (movie: any) => {
  const { production_countries } = movie;
  const country = production_countries?.[0]?.iso_3166_1;

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

export default MovieKeyword;
