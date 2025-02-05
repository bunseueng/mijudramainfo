"use client";

const AdBanner = dynamic(() => import("../Adsense/AdBanner"), { ssr: false });
import { DramaPagination } from "@/app/component/ui/Pagination/DramaPagination";
import Image from "next/image";
import { Dispatch, SetStateAction, Suspense } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import { StyledRating } from "@/app/actions/StyleRating";
import { convertToFiveStars } from "@/app/actions/convertToFiveStar";
import dynamic from "next/dynamic";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import TopActor from "../Main/TopActor";
import { MovieDB, PersonDBType, TVShow } from "@/helper/type";
import PlayMovieTrailer from "@/app/(route)/(id)/movie/[id]-[slug]/PlayMovieTrailer";
import AdArticle from "../Adsense/AdArticle";
const DramaFilter = dynamic(
  () => import("@/app/(route)/(drama)/drama/top/DramaFilter"),
  { ssr: false }
);
const SearchLoading = dynamic(() => import("../Loading/SearchLoading"), {
  ssr: false,
});

type ExploreMovieCardProps = {
  title: string;
  totalItems: TVShow[];
  total_results: number;
  getMovie: MovieDB[];
  personDB: PersonDBType[];
  tvRating: any;
  per_page: number;
  setPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  items: number;
};

const ExploreMovieCard = ({
  title,
  total_results,
  getMovie,
  personDB,
  totalItems,
  tvRating,
  per_page,
  setPage,
  currentPage,
  items,
}: ExploreMovieCardProps) => {
  return (
    <div className="flex flex-col max-w-6xl mx-auto py-4 px-4 lg:px-0 overflow-hidden">
      <div className="hidden md:block w-full h-[200px] mb-10 order-first">
        <AdArticle dataAdFormat="auto" dataAdSlot="3527489220" />
      </div>
      <div className="w-full md:max-w-[1150px] mx-auto py-5 order-last md:order-first">
        <TopActor heading="Top Actors" personDB={personDB} />
      </div>
      <div className="flex flex-col mt-10 order-first md:order-last">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-4/6 pr-1 md:pr-3">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p>{total_results} results</p>
            </div>
            {totalItems
              ?.filter((genre: any) => genre?.genre_ids.length > 0)
              ?.map((movie: any, idx: number) => {
                const startCal = (currentPage - 1) * per_page;
                const overallIndex = startCal + idx + 1;
                const coverFromDB = getMovie?.find((d: any) =>
                  d?.tv_id?.includes(movie?.id)
                );
                return (
                  <div
                    className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
                    key={movie?.id}
                  >
                    <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                      <div className="relative">
                        <Link
                          prefetch={false}
                          href={`/tv/${movie?.id}-${spaceToHyphen(
                            movie?.title || movie?.name
                          )}`}
                        >
                          {movie?.poster_path ||
                          movie?.backdrop_path !== null ? (
                            <Image
                              src={
                                coverFromDB
                                  ? (coverFromDB?.cover as string)
                                  : `https://image.tmdb.org/t/p/original/${
                                      movie.poster_path || movie.backdrop_path
                                    }`
                              }
                              alt={
                                movie?.name || movie?.title || "Movie Poster"
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
                              alt={
                                movie?.name || movie?.title || "Movie Poster"
                              }
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
                            movie?.title || movie?.name
                          )}`}
                          className="text-lg text-sky-700 dark:text-[#2196f3] font-bold"
                        >
                          {movie?.name || movie?.title}
                        </Link>
                        <p>#{overallIndex}</p>
                      </div>
                      <p className="text-slate-400 py-1">
                        {(movie?.original_language === "zh" &&
                          "Chinese Movie") ||
                          (movie?.original_language === "ja" &&
                            "Japanese Movie") ||
                          (movie?.original_language === "ko" && "Korean Movie")}
                        {movie?.original_language === "en" && "Movie"}
                        <span>
                          {" "}
                          - {movie?.first_air_date || movie?.release_date}
                        </span>
                      </p>
                      <div className="flex items-center">
                        <StyledRating
                          name="customized-color"
                          value={convertToFiveStars(
                            movie &&
                              movie.vote_average &&
                              tvRating &&
                              tvRating[idx]
                              ? (movie.vote_average + tvRating[idx]) / 2
                              : tvRating && tvRating[idx]
                              ? tvRating[idx] / 2
                              : movie && movie.vote_average,
                            10
                          )}
                          readOnly
                          icon={<FavoriteIcon fontSize="inherit" />}
                          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                          precision={0.5}
                        />
                        <p className="pl-2 pt-1">
                          {movie &&
                          movie.vote_average &&
                          tvRating &&
                          tvRating[movie.id]
                            ? (
                                (movie.vote_average * (movie.vote_count || 0) +
                                  (tvRating[movie.id] || 0) * 10) /
                                ((movie.vote_count || 0) + 10)
                              ).toFixed(1)
                            : tvRating && tvRating[movie.id]
                            ? tvRating[movie.id].toFixed(1)
                            : movie && movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "0.0"}
                        </p>
                      </div>
                      <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
                        {movie?.overview ||
                          "This movie currently has no synosis."}
                      </p>
                      <div className="flex items-center">
                        <Suspense fallback={<div>Loading...</div>}>
                          <PlayMovieTrailer video={movie?.videos} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="w-full md:w-2/6 pl-1 md:pl-3 lg:pl-3">
            <div className="w-full h-[200px] mb-10">
              <AdBanner dataAdFormat="auto" dataAdSlot="3527489220" />
            </div>
            <div className="border bg-white dark:bg-[#242424] rounded-lg">
              <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727]">
                Advanced Search
              </h1>
              <Suspense fallback={<SearchLoading />}>
                <DramaFilter />
              </Suspense>
            </div>
            <div className="hidden md:block h-screen mx-auto my-5">
              <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
            </div>
          </div>
        </div>
        <div className="my-5">
          <Suspense fallback={<div>Loading...</div>}>
            <DramaPagination setPage={setPage} totalItems={items} />
          </Suspense>
        </div>
      </div>{" "}
      <div className="block md:hidden w-full h-[300px] mx-auto my-5 order-last">
        <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
      </div>
    </div>
  );
};

export default ExploreMovieCard;
