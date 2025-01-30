"use client";

import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import {
  fetchTvKeywords,
  fetchTv,
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

const PlayTrailer = dynamic(
  () => import("@/app/(route)/(drama)/drama/top/PlayTrailer"),
  { ssr: false }
);

interface Network {
  keyword_id: string;
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
              {getDramaType(drama)}
              <span>
                {" "}
                -{" "}
                {getYearFromDate(drama?.first_air_date || drama?.release_date)}
                {tvDetail?.number_of_episodes ? ", " : ""}{" "}
                {tvDetail?.number_of_episodes}{" "}
                {tvDetail?.number_of_episodes ? "Episodes" : ""}
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

const Keyword: React.FC<Network> = ({ keyword_id }) => {
  const [sortby, setSortby] = useState<string>();
  const [genre, setGenre] = useState<string>("18");
  const [country, setCountry] = useState<string>("CN");
  const [withoutGenre, setWithoutGenre] = useState<string>("16|10767|10764|35");
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const per_page = Number.parseInt(searchParams?.get("per_page") || "20");

  // Update the component to use the TV details again
  const { data: keywordDetails, isLoading: isKeywordLoading } = useQuery({
    queryKey: [
      "keywordDetails",
      currentPage,
      keyword_id,
      sortby,
      genre,
      withoutGenre,
      country,
    ],
    queryFn: () =>
      fetchTvKeywords(
        currentPage,
        keyword_id,
        sortby,
        genre,
        withoutGenre,
        country
      ),
    staleTime: 3600000,
  });

  const totalItems = keywordDetails?.results?.slice(0, per_page) || [];
  const tvIds = totalItems.map((item: any) => item.id.toString());

  const { data: tvDetails, isLoading: isTvDetailsLoading } = useQuery({
    queryKey: ["tvDetails", tvIds],
    queryFn: () => fetchTv(tvIds),
    staleTime: 3600000,
    enabled: !!tvIds.length,
  });

  const { data: ratings, isLoading: isRatingsLoading } = useQuery({
    queryKey: ["ratings", tvIds],
    queryFn: () => fetchRatings(tvIds),
    staleTime: 3600000,
    enabled: !!tvIds.length,
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
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%] px-1 md:px-3">
            <div className="flex items-center justify-between mb-5">
              <p>{keywordDetails?.total_results} results</p>
            </div>
            {totalItems?.map((drama: any, idx: number) => {
              const startCal = (currentPage - 1) * per_page;
              const overallIndex = startCal + idx + 1;
              const tvDetail = tvDetails?.find(
                (data: any) => data.id === drama.id
              );

              return (
                <DramaCard
                  key={drama?.id}
                  drama={drama}
                  tvDetail={tvDetail}
                  ratings={ratings}
                  overallIndex={overallIndex}
                />
              );
            })}
          </div>

          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3">
            <FilterSection
              genre={genre}
              setGenre={setGenre}
              setWithoutGenre={setWithoutGenre}
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
  setWithoutGenre: (withoutGenre: string) => void;
  country: string;
  setCountry: (country: string) => void;
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}> = ({
  genre,
  setGenre,
  setWithoutGenre,
  country,
  setCountry,
  sortby,
  setSortby,
}) => {
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
                  genre === "18" ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name="18"
                  value="18"
                  checked={genre === "18"}
                  onChange={() => {
                    setGenre("18");
                    setWithoutGenre("16|10767|10764|35");
                  }}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>Drama</span>
              </label>
            </div>
            <div className="relative float-left w-full px-3 mt-2">
              <label
                className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                  genre === "16" ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name="16"
                  value="16"
                  checked={genre === "16"}
                  onChange={() => {
                    setGenre("16");
                    setWithoutGenre("10767|10764");
                  }}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>Anime</span>
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

const getDramaType = (drama: any) => {
  const { origin_country, genre_ids } = drama;
  const country = origin_country?.[0];
  const isDrama =
    !genre_ids?.includes(10764) &&
    !genre_ids?.includes(10767) &&
    !genre_ids?.includes(16) &&
    (genre_ids?.includes(18) ||
      genre_ids?.includes(10765) ||
      genre_ids?.includes(35));
  const isTVShow =
    (genre_ids.includes(10764) || genre_ids.includes(10767)) &&
    !genre_ids?.includes(18) &&
    !genre_ids?.includes(16) &&
    !genre_ids?.includes(10765);
  const isAnime =
    genre_ids?.includes(16) &&
    !genre_ids?.includes(10764) &&
    !genre_ids?.includes(10767);

  if (isDrama) {
    switch (country) {
      case "CN":
        return "Chinese Drama";
      case "JP":
        return "Japanese Drama";
      case "KR":
        return "Korean Drama";
      case "TW":
        return "Taiwanese Drama";
      case "HK":
        return "Hong Kong Drama";
      case "TH":
        return "Thailand Drama";
      default:
        return "Drama";
    }
  } else if (isTVShow) {
    switch (country) {
      case "CN":
        return "Chinese TV Show";
      case "JP":
        return "Japanese TV Show";
      case "KR":
        return "Korean TV Show";
      default:
        return "TV Show";
    }
  } else if (isAnime) {
    return "Anime";
  }
  return "Other";
};

export default Keyword;
