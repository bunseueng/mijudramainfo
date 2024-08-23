"use client";

import { DramaPagination } from "@/app/component/ui/Pagination/DramaPagination";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import DramaFilter from "@/app/(route)/(drama)/drama/top/DramaFilter";
import PlayMovieTrailer from "@/app/(route)/(drama)/movie/top/PlayMovieTrailer";
import { StyledRating } from "@/app/actions/StyleRating";
import { convertToFiveStars } from "@/app/actions/convertToFiveStar";

const ExploreMovieCard = ({ title, movie }: any) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(1);
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (page - 1) * per_page;
  const end = start + Number(per_page);
  const items = movie?.total_results;
  const totalItems = movie?.results?.slice(start, end);

  return (
    <div className="max-w-[1520px] mx-auto py-4 px-4 md:px-6">
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%]">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p>{movie?.total_results} results</p>
            </div>
            {totalItems
              ?.filter((genre: any) => genre?.genre_ids.length > 0)
              ?.map((movie: any, idx: number) => {
                const startCal = (currentPage - 1) * per_page;
                const overallIndex = startCal + idx + 1;
                return (
                  <div
                    className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
                    key={movie?.id}
                  >
                    <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                      <div className="relative">
                        <Link href={`/tv/${movie?.id}`}>
                          {movie?.poster_path ||
                          movie?.backdrop_path !== null ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/original/${
                                movie.poster_path || movie.backdrop_path
                              }`}
                              alt={movie?.name || movie?.title}
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
                    <div className="pl-2 md:pl-3 w-[80%]">
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl text-sky-700 dark:text-[#2196f3] font-bold">
                          {movie?.name || movie?.title}
                        </h1>
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
                          value={convertToFiveStars(movie?.vote_average, 10)}
                          readOnly
                          icon={<FavoriteIcon fontSize="inherit" />}
                          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                          precision={0.5}
                        />
                        <p className="pl-2 pt-1">
                          {movie?.vote_average.toFixed(1)}
                        </p>
                      </div>
                      <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
                        {movie?.overview}
                      </p>
                      <div className="flex items-center">
                        <Suspense fallback={<div>Loading...</div>}>
                          <PlayMovieTrailer movie_id={movie?.id} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="w-full md:w-[30%]">
            <div className="border bg-white dark:bg-[#242424] rounded-lg ml-4 lg:ml-10">
              <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:bg-[#272727]">
                Advanced Search
              </h1>
              <Suspense fallback={<div>Loading...</div>}>
                <DramaFilter />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <Suspense fallback={<div>Loading...</div>}>
          <DramaPagination setPage={setPage} totalItems={items} />
        </Suspense>
      </div>
    </div>
  );
};

export default ExploreMovieCard;
