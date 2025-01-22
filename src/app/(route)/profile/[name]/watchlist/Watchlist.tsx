"use client";

import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";
import WatchlistRating from "@/app/component/ui/CircleRating/WatchlistRating";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IList, SearchParamsType, WatchListProps } from "@/helper/type";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiCircleList } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const Watchlist: React.FC<WatchListProps & IList> = ({
  tv_id,
  existedFavorite,
  user,
  list,
  movieId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortby = searchParams?.get("sortby") ?? "";
  const queryKey = ["tv", "movie"];

  const {
    data: tv,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!tv_id || (Array.isArray(tv_id) && tv_id.length === 0)) return [];

      // Handle tv_id and movieId
      const tvId = Array.isArray(tv_id)
        ? tv_id.map((item) => item?.id)
        : [tv_id.id];
      const movie_id = Array.isArray(movieId)
        ? movieId.map((item) => item?.id)
        : [movieId.movieId];

      // Fetch TV details and add media_type property
      const tvDetails = await Promise.all(
        tvId.map(async (id: number) => {
          const tvDetail = await fetchTv(id);
          return { ...tvDetail, media_type: "tv" }; // Add media_type property
        })
      );

      // Fetch movie details and add media_type property
      const movieDetails = await Promise.all(
        movie_id.map(async (id: number) => {
          const movieDetail = await fetchMovie(id);
          return { ...movieDetail, media_type: "movie" }; // Add media_type property
        })
      );

      // Combine TV and movie details
      let sortedTvDetails = [...tvDetails, ...movieDetails];

      // Sort the combined list based on the sortby option
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
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const selectBox = (key: any, value: any) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
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

  const addToList = async (listId: string, tvId: string, movieId: string) => {
    try {
      const res = await fetch(`/api/list`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: listId,
          tvId: tvId,
          movieId: movieId,
        }),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onFavorite = async (favId: string) => {
    try {
      const res = await fetch(`/api/favorite/${favId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: favId,
        }),
      });
      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDeleteFavorite = async (favId: string) => {
    try {
      const res = await fetch(`/api/favorite/${favId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteIds: favId,
        }),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const onDeleteWatchlist = async (favId: string) => {
    try {
      const res = await fetch(`/api/watchlist/${favId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: favId,
        }),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed.");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    refetch();
  }, [sortby, refetch]);

  if (isLoading || !tv) {
    return <SearchLoading />;
  }
  return (
    <div className="mt-4 pl-0 md:pl-4">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-black dark:text-white text-xs md:text-sm lg:text-xl font-bold">
          My Watchlist
        </h1>
        {pathname === `/profile/${user?.name}/watchlist` && (
          <div className="flex items-center justify-between">
            <label htmlFor="Filter" className="text-xs md:text-sm lg:text-md">
              Filter by:
            </label>
            <div className="flex items-center flex-nowrap ">
              <div className="p-2 md:p-4">
                <select
                  className="bg-transparent text-xs md:text-base text-black dark:text-white bg-gray-700 border-b-2 border-b-[#959595] rounded-t-sm relative top-0 left-0 z-2 md:pl-2 cursor-pointer"
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
            className="w-full h-auto flex flex-col md:flex-row bg-white dark:bg-[#1b1c1d] border border-slate-200 dark:border-[#272727] rounded-md overflow-hidden my-5 box-border"
          >
            <div className="w-full md:w-[160px] h-[120px] md:h-[250px] box-border">
              <div className="w-full h-full">
                <Link
                  href={`/tv/${item?.id}-${spaceToHyphen(
                    item?.title || item?.name
                  )}`}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${
                      item?.poster_path || item?.backdrop_path
                    }}`}
                    alt={`${item?.title || item?.name}'s Poster`}
                    width={200}
                    height={200}
                    quality={100}
                    priority
                    className="block w-full md:w-[160px] min-w-[160px] h-full outline-none box-border bg-center object-cover"
                  />
                </Link>
              </div>
            </div>
            <div className="w-full align-middle px-3 my-5">
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
                      <h1 className="text-black dark:text-white text-sm md:text-md font-bold">
                        {item?.name || item?.title}{" "}
                        <span className="text-[#999]">
                          ({item?.original_name})
                        </span>
                      </h1>
                    </div>
                    <h4 className="text-xs md:text-sm">
                      {item?.first_air_date}
                    </h4>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-sm truncates">{item?.overview}</p>
                </div>
              </div>

              <div className="w-full flex mt-2 md:mt-5 box-border">
                <ul className="flex items-center flex-wrap">
                  <li className="text-[#959595] flex items-center mr-3 mb-2 md:mb-0 md:mr-5">
                    {Array.isArray(existedFavorite) ? (
                      existedFavorite.includes(item?.id) ? (
                        <>
                          <span
                            className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-[#ef47b6] border-2 border-[#ef47b6] rounded-full cursor-pointer"
                            onClick={() => onDeleteFavorite(item?.id)}
                          >
                            <FaHeart className="text-white text-sm" />
                          </span>
                          <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                            Favorite
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-[#959595] border-2 border-[#959595] rounded-full cursor-pointer"
                            onClick={() => onFavorite(item?.id)}
                          >
                            <FaHeart className="text-white text-sm" />
                          </span>
                          <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                            Favorite
                          </span>
                        </>
                      )
                    ) : null}
                  </li>
                  <li className="text-[#959595] flex items-center mr-3 mb-2 md:mb-0 md:mr-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-transparent border-2 border-[#959595] rounded-full">
                          <CiCircleList className="text-[#c0c0c0] dark:text-white text-md" />
                        </span>
                        <span className="text-[#c0c0c0] dark:text-[#959595] ml-2">
                          Add to list
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          <Link href="/lists/create" className="cursor-pointer">
                            <span className="inline-block align-middle">
                              <FaPlus className="mr-1" />
                            </span>
                            Create New List
                          </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                              >
                                {value
                                  ? list?.find(
                                      (list) => list.listTitle === value
                                    )?.listTitle
                                  : "Select list..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search list..." />
                                <CommandList>
                                  <CommandEmpty>No list found.</CommandEmpty>
                                  <CommandGroup>
                                    {list?.map((lItem) => {
                                      const tvId =
                                        item?.media_type === "tv" && item?.id;
                                      const movieId =
                                        item?.media_type === "movie" &&
                                        item?.id;

                                      return (
                                        <CommandItem
                                          key={lItem.listTitle}
                                          value={lItem.listTitle}
                                          onSelect={(currentValue) => {
                                            setValue(
                                              currentValue === value
                                                ? ""
                                                : currentValue
                                            );
                                            setOpen(false);
                                            addToList(
                                              lItem?.listId,
                                              tvId,
                                              movieId
                                            );
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === lItem.listTitle
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {lItem.listTitle}
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li
                    className="text-[#959595] flex items-center mr-3 md:mr-5 cursor-pointer"
                    onClick={() => onDeleteWatchlist(item?.id)}
                  >
                    <span className="w-6 h-6 md:w-8 md:h-8 inline-flex items-center justify-center bg-transparent border-2 border-[#959595] rounded-full">
                      <IoMdClose className="text-[#c0c0c0] dark:text-white text-md" />
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
