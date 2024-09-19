"use client";

import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  currentUserProps,
  IRating,
  List,
  Rating,
  UserProps,
} from "@/helper/type";
import ListCard from "./ListCard";

export interface Lists {
  findSpecificRating: IRating[];
  userRating: Rating[];
  yourRating: Rating[];
  list: List | null;
  currentUser: currentUserProps | null;
  user: UserProps | null;
}

const Lists: React.FC<Lists> = ({
  list,
  user,
  findSpecificRating,
  userRating,
  yourRating,
  currentUser,
}) => {
  const {
    data: listResult,
    refetch: refetchData,
    isLoading,
  } = useQuery({
    queryKey: ["listResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        list?.tvId?.map(async (id: number) => await fetchTv(id)) || []
      );
      const movieDetails = await Promise.all(
        list?.movieId?.map(async (id: number) => await fetchMovie(id)) || []
      );
      return [...tvDetails, ...movieDetails];
    },
    enabled: true, // Ensures the query runs immediately
  });

  if (isLoading) {
    <div>Fetching...</div>;
  }

  return (
    <div className=" w-full h-full">
      <div className="relative z-20 h-full flex flex-wrap content-between justify-center">
        <div
          className="relative overflow-hidden bg-cover object-center bg-no-repeat w-full h-auto"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${list?.thumbnail})`,
            backgroundPosition: "center",
            backgroundSize: "cover", // Ensure the image covers the area
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(24, 40, 72, 0.65) calc((50vw - 170px) - 340px), rgba(24, 40, 72, 0.65) 50%, rgba(24, 40, 72, 0.65) 100%)",
            }}
          >
            <div className="w-full max-w-6xl mx-auto flex flex-col justify-center p-5">
              <div className="flex flex-col justify-start lg:flex-row lg:items-end gap-x-5">
                <Link href="">
                  <h2 className="text-3xl font-bold text-white p-0">
                    {list?.listTitle}
                  </h2>
                </Link>
              </div>
              <span className="my-4 [&>p]:p-0 text-md md:text-xl text-white">
                <p>{list?.description}</p>
              </span>
              <div className="flex items-center">
                <Image
                  src={user?.profileAvatar || (user?.image as string)}
                  alt=""
                  width={200}
                  height={200}
                  quality={100}
                  className="block w-[40px] h-[40px] bg-center bg-cover object-cover rounded-full"
                />
                <div className="flex items-center ml-2">
                  <span className="text-md md:text-xl text-white">
                    A list by
                  </span>
                  <Link
                    href=""
                    className="text-white text-2xl opacity-75 font-semibold hover:underline underline-offset-2 pl-2"
                  >
                    {user?.displayName || user?.name}
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center bg-black/40 py-2">
              <div className="w-full max-w-6xl mx-auto flex px-5 gap-3">
                <button className="flex items-center text-md text-white/50">
                  <Link
                    href={`/lists/${list?.listId}/edit`}
                    className="font-semibold"
                  >
                    Edit
                  </Link>
                </button>
                <button className="flex items-center text-md text-white/50 font-semibold">
                  Share
                </button>
                <button className="hidden items-center text-md text-white/50 font-semibold">
                  Collaborate
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center bg-black/70">
              <div className="w-full max-w-6xl max-auto flex px-5 gap-3">
                <div className="flex flex-wrap items-center justify-start md:gap-8 text-white font-bold md:w-full md:max-w-[1400px] py-4">
                  <div className="w-1/2 md:w-fit flex flex-col pb-3 md:pb-0">
                    <h3 className="text-2xl md:text-4xl/8 leading-5 p-0">
                      {list?.tvId?.length || list?.movieId?.length}
                    </h3>
                    <span className="text-base md:text-lg font-semibold">
                      Items on this list
                    </span>
                  </div>
                  <div className="w-1/2 md:w-fit flex flex-col pb-3 md:pb-0">
                    <h3 className="text-2xl md:text-4xl/8 leading-5 p-0">
                      68%
                    </h3>
                    <span className="text-base md:text-lg font-semibold">
                      Average Rating
                    </span>
                  </div>
                  <div className="w-1/2 md:w-fit flex flex-col">
                    <h3 className="text-2xl md:text-4xl/8 leading-5 p-0">
                      0h 0m
                    </h3>
                    <span className="text-base md:text-lg font-semibold">
                      Total Runtime
                    </span>
                  </div>
                  <div className="w-1/2 md:w-fit flex flex-col">
                    <h3 className="text-2xl md:text-4xl/8 leading-5 p-0">$0</h3>
                    <span className="text-base md:text-lg font-semibold">
                      Total Revenue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListCard
        list={list}
        user={user}
        listResult={listResult}
        findSpecificRating={findSpecificRating}
        userRating={userRating}
        yourRating={yourRating}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Lists;
