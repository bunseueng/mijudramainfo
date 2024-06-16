"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import WatchlistRating from "@/app/component/ui/CircleRating/WatchlistRating";
import { SearchParamsType, WatchListProps } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { CiCircleList } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Watchlist: React.FC<WatchListProps> = ({
  tv_id,
  existedFavorite,
  user,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortby = searchParams?.get("sortby") ?? "";

  const {
    data: tv,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tv"],
    queryFn: async () => {
      if (!tv_id || (Array.isArray(tv_id) && tv_id.length === 0)) return [];
      const tvId = Array.isArray(tv_id)
        ? tv_id.map((item) => item?.id)
        : [tv_id.id];
      const tvDetails = await Promise.all(
        tvId.map(async (id: number) => await fetchTv(id))
      );

      let sortedTvDetails = [...tvDetails];

      if (sortby === "asc") {
        sortedTvDetails.sort(
          (a, b) =>
            new Date(a.first_air_date).getTime() -
            new Date(b.first_air_date).getTime()
        );
      } else if (sortby === "desc") {
        sortedTvDetails.sort(
          (a, b) =>
            new Date(b.first_air_date).getTime() -
            new Date(a.first_air_date).getTime()
        );
      } else if (sortby === "upcoming") {
        const now = new Date();
        sortedTvDetails = sortedTvDetails
          .filter((item) => new Date(item.first_air_date) > now)
          .sort(
            (a, b) =>
              new Date(a.first_air_date).getTime() -
              new Date(b.first_air_date).getTime()
          );
      } else if (sortby === "popularity") {
        sortedTvDetails.sort((a, b) => b.popularity - a.popularity);
      }

      return sortedTvDetails;
    },
    enabled: !!sortby,
  });

  const selectBox = (key: any, value: any) => {
    const params = new URLSearchParams(searchParams as SearchParamsType);
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    values = [value];

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }

    query["sortby"] = value;

    const queryString = new URLSearchParams(query).toString();

    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
  };

  React.useEffect(() => {
    refetch();
  }, [sortby, refetch]);

  if (isLoading || !tv) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 pl-4">
      <div className="flex items-center justify-between">
        <h1 className="text-black dark:text-white text-xl md:text-2xl font-bold">
          My Watchlist
        </h1>
        {pathname === `/profile/${user?.name}/watchlist` && (
          <div className="flex items-center flex-nowrap">
            <h1>Filter by:</h1>
            <div className="flex items-center flex-nowrap">
              <div className="p-4">
                <select
                  className="bg-transparent text-white bg-gray-700 border-b-2 border-b-[#959595] rounded-t-sm relative top-0 left-0 z-2 pl-2 cursor-pointer"
                  name="sort"
                  id="sort"
                  onChange={(e) => selectBox("sortby", e.target.value)}
                >
                  <option value="asc">Date Ascending</option>
                  <option value="desc">Date Descending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {Array.isArray(tv) &&
        tv?.map((item: any, idx: number) => (
          <div
            key={idx}
            className="w-full h-auto flex bg-white dark:bg-[#242424] border-2 border-slate-200 dark:border-[#272727] rounded-md overflow-hidden my-5 box-border"
          >
            <div className="w-[160px] min-w-[160px] h-[250px] box-border">
              <div className="w-full h-full flex items-center justify-center box-border">
                <Link href="/" className="box-border">
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${
                      item?.poster_path || item?.backdrop_path
                    }}`}
                    alt="drama image"
                    width={200}
                    height={200}
                    quality={100}
                    className="block w-[160px] min-w-[160px] h-[250px] outline-none box-border"
                  />
                </Link>
              </div>
            </div>
            <div className="w-full flex flex-wrap items-center align-middle px-3 py-2 md:py-4">
              <div className="w-full">
                <div className="flex items-start md:items-center w-full">
                  <div className="mr-2">
                    <WatchlistRating
                      rating={
                        item?.vote_average < 1
                          ? "NR"
                          : item?.vote_average?.toFixed(1)
                      }
                    />
                  </div>
                  <div className="w-full flex flex-col align-baseline overflow-hidden">
                    <div className="">
                      <h1 className="text-black dark:text-white text-md md:text-xl font-bold">
                        {item?.name || item?.title}{" "}
                        <span className="text-[#999]">
                          ({item?.original_name})
                        </span>
                      </h1>
                    </div>
                    <h4 className="text-sm md:text-md">
                      {item?.first_air_date}
                    </h4>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="truncates">{item?.overview}</p>
                </div>
              </div>

              <div className="w-full flex mt-2 md:mt-5 box-border">
                <ul className="flex items-center flex-wrap">
                  <li className="text-[#959595] flex items-center mr-3 mb-2 md:mb-0 md:mr-5">
                    {Array.isArray(existedFavorite) ? (
                      existedFavorite.includes(item?.id) ? (
                        <>
                          <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-[#ef47b6] border-2 border-[#ef47b6] rounded-full">
                            <FaHeart className="text-white text-md" />
                          </span>
                          <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                            Favorite
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-[#959595] border-2 border-[#959595] rounded-full">
                            <FaHeart className="text-white text-md" />
                          </span>
                          <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                            Favorite
                          </span>
                        </>
                      )
                    ) : null}
                  </li>
                  <li className="text-[#959595] flex items-center mr-3 mb-2 md:mb-0 md:mr-5">
                    <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-transparent border-2 border-[#959595] rounded-full">
                      <CiCircleList className="text-white text-md" />
                    </span>
                    <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                      Add to list
                    </span>
                  </li>
                  <li className="text-[#959595] flex items-center mr-3 md:mr-5">
                    <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-transparent border-2 border-[#959595] rounded-full">
                      <IoMdClose className="text-white text-md" />
                    </span>
                    <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                      Remove
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Watchlist;
