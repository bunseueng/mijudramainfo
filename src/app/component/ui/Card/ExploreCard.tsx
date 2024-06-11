"use client";

import { getYearFromDate } from "@/app/(route)/(id)/tv/[id]/DramaMain";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import { DramaPagination } from "@/app/component/ui/Pagination/DramaPagination";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material";
import Link from "next/link";
import PlayTrailer from "@/app/(route)/(drama)/drama/top/PlayTrailer";
import DramaFilter from "@/app/(route)/(drama)/drama/top/DramaFilter";

interface TotalEpisodes {
  [key: string]: number;
}

export const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

// Function to convert total value to fit within the range of 0 to 5
export const convertToFiveStars = (value: number, totalValue: number) => {
  return (value / totalValue) * 5;
};

const ExploreCard = ({ title, topDramas, total_results }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const per_page = searchParams.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = topDramas?.total_results;
  const totalItems = topDramas?.results?.slice(start, end);
  const [totalEpisodes, setTotalEpisodes] = useState<TotalEpisodes>({});
  const [tvRating, setTvRating] = useState<any>();

  useEffect(() => {
    if (topDramas) {
      topDramas?.results?.forEach(async (drama: any) => {
        const tvData = await fetchTv(drama.id);
        setTotalEpisodes((prev) => ({
          ...prev,
          [drama.id]: calculateTotalEpisodes(tvData),
        }));
      });
    }
  }, [topDramas]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (
          !topDramas ||
          !topDramas.results ||
          topDramas.results.length === 0
        ) {
          console.log("No items to fetch ratings for.");
          return;
        }

        const tvIds = topDramas.results.map((item: any) => item.id.toString());
        const averageRatings: { [key: string]: number } = {};

        for (const id of tvIds) {
          const getRatings = await fetch(`/api/rating/${id}`);
          const data = await getRatings.json();
          const ratings = data?.ratings || [];

          // Filter ratings by tvId
          const filteredRatings = ratings.filter(
            (rating: any) => rating.tvId === id.toString()
          );

          // Get the number of ratings
          const numberOfRatings = filteredRatings.length;

          // Sum up all the ratings
          const sumOfRatings = filteredRatings.reduce(
            (sum: number, rating: any) => sum + rating.rating,
            0
          );

          // Calculate the average rating
          const averageRating =
            numberOfRatings > 0 ? sumOfRatings / numberOfRatings : 0;

          averageRatings[id] = averageRating;
          console.log(numberOfRatings);
        }

        setTvRating(averageRatings);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchRating();
  }, [topDramas]);

  const calculateTotalEpisodes = (tvData: any) => {
    let totalEpisodes = 0;
    const seasonIds: string[] = [];

    if (tvData && tvData.seasons) {
      Object.keys(tvData.seasons).forEach((key) => {
        const season = tvData.seasons[key];
        if (season.episode_count) {
          totalEpisodes += parseInt(season.episode_count);
          seasonIds.push(season.id); // Push the ID of the season
        }
      });
    }

    return totalEpisodes;
  };

  return (
    <div className="max-w-[1520px] mx-auto py-4 px-4 md:px-6">
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%]">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p>{total_results} results</p>
            </div>
            {totalItems
              ?.filter((genre: any) => genre?.genre_ids.length > 0)
              ?.map((drama: any, idx: number) => (
                <div
                  className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
                  key={drama?.id}
                >
                  <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                    <div className="relative">
                      <Link href={`/tv/${drama?.id}`}>
                        {drama?.poster_path || drama?.backdrop_path !== null ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${
                              drama.poster_path || drama.backdrop_path
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
                  <div className="pl-2 md:pl-3 w-[80%]">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/tv/${drama?.id}`}
                        className="text-xl text-sky-700 dark:text-[#2196f3] font-bold"
                      >
                        {drama?.name || drama?.title}
                      </Link>
                      <p>#{idx + 1}</p>
                    </div>
                    <p className="text-slate-400 py-1">
                      {(drama?.origin_country?.[0] === "CN" &&
                        !drama?.genre_ids?.includes(10764) &&
                        !drama?.genre_ids?.includes(10767) &&
                        "Chinese Drama") ||
                        (drama.origin_country?.[0] === "JP" &&
                          !drama?.genre_ids?.includes(10764) &&
                          !drama?.genre_ids?.includes(10767) &&
                          "Japanese Drama") ||
                        (drama.origin_country?.[0] === "KR" &&
                          !drama?.genre_ids?.includes(10764) &&
                          !drama?.genre_ids?.includes(10767) &&
                          "Korean Drama")}
                      {drama?.origin_country?.[0] === "CN" &&
                        drama?.genre_ids.includes(10764) &&
                        drama?.genre_ids.includes(10767) &&
                        "Chinese TV Show"}
                      {drama?.origin_country?.[0] === "JP" &&
                        drama?.genre_ids.includes(10764) &&
                        drama?.genre_ids.includes(10767) &&
                        "Japanese TV Show"}
                      {drama?.origin_country?.[0] === "KR" &&
                        drama?.genre_ids.includes(10764) &&
                        drama?.genre_ids.includes(10767) &&
                        "Korean TV Show"}
                      <span>
                        {" "}
                        -{" "}
                        {getYearFromDate(
                          drama?.first_air_date || drama?.release_date
                        )}
                        {!totalEpisodes[drama.id] ? "" : ","}{" "}
                        {totalEpisodes[drama.id]}{" "}
                        {!totalEpisodes[drama.id] ? "" : "Episodes"}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <StyledRating
                        name="customized-color"
                        value={convertToFiveStars(
                          drama &&
                            drama.vote_average &&
                            tvRating &&
                            tvRating[idx]
                            ? (drama.vote_average + tvRating[idx]) / 2
                            : tvRating && tvRating[idx]
                            ? tvRating[idx] / 2
                            : drama && drama.vote_average,
                          10
                        )}
                        readOnly
                        icon={<FavoriteIcon fontSize="inherit" />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                        precision={0.5}
                      />
                      <p className="pl-2 pt-1">
                        {drama &&
                        drama.vote_average &&
                        tvRating &&
                        tvRating[drama.id]
                          ? (
                              (drama.vote_average * (drama.vote_count || 0) +
                                (tvRating[drama.id] || 0) * 10) /
                              ((drama.vote_count || 0) + 10)
                            ).toFixed(1)
                          : tvRating && tvRating[drama.id]
                          ? tvRating[drama.id].toFixed(1)
                          : drama && drama.vote_average
                          ? drama.vote_average.toFixed(1)
                          : "0.0"}
                      </p>
                    </div>
                    <p className="text-md font-semibold line-clamp-3 truncate whitespace-normal my-2">
                      {drama?.overview}
                    </p>
                    <div className="flex items-center">
                      <PlayTrailer tv_id={drama?.id} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full md:w-[30%]">
            <div className="border bg-white dark:bg-[#242424] rounded-lg ml-4 lg:ml-10">
              <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727]">
                Advanced Search
              </h1>
              <DramaFilter />
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <DramaPagination setPage={setPage} totalItems={items} />
      </div>
    </div>
  );
};

export default ExploreCard;
