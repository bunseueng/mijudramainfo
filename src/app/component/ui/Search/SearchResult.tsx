"use client";

import { fetchMultiSearch } from "@/app/actions/fetchMovieApi";
import { SearchParamsType } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdLocalMovies } from "react-icons/md";
import { PiTelevisionDuotone } from "react-icons/pi";
import { RiHistoryFill } from "react-icons/ri";

const SearchResult = () => {
  const [showResults, setShowResults] = useState(true); // State to manage visibility of search results
  const searchParams = useSearchParams();
  let searchQuery = searchParams?.get("query") ?? "";
  const params = new URLSearchParams(
    searchParams as unknown as SearchParamsType
  );
  const { data: results } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => fetchMultiSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const handleClick = () => {
    setShowResults(false); // Hide search results when clicking on a result
  };
  console.log(results);
  return (
    <>
      {results?.length === 0 ? (
        <div className="w-full bg-white">
          <div className="border-b-2 border-b-slate-300 hover:bg-[#e0e0e040]">
            <div className="max-w-6xl mx-auto relative">
              <div className="h-screen bg-white p-8">
                <p className="text-slate-400 text-center text-3xl uppercase font-semibold px-14 py-1 cursor-pointer hover:opacity-70 duration-300 truncate">
                  No Results
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white">
          {showResults &&
            results?.map((item: any, idx: number) => (
              <div
                className="border-b-2 border-b-slate-300 hover:bg-[#e0e0e040]"
                key={idx}
              >
                <div className="max-w-6xl mx-auto relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pl-3 pointer-events-none">
                    {item?.media_type === "person" ? (
                      <FaUser size={13} className="dark:text-black" />
                    ) : item?.media_type === "tv" ? (
                      <PiTelevisionDuotone
                        size={13}
                        className="dark:text-black"
                      />
                    ) : item?.media_type === "movie" ? (
                      <MdLocalMovies size={13} className="dark:text-black" />
                    ) : (
                      <RiHistoryFill size={20} className="dark:text-black" />
                    )}
                  </div>
                  <Link
                    href={`/search/?${params.toString()}`}
                    className="text-black font-semibold px-14 py-1 cursor-pointer hover:opacity-70 duration-300 truncate"
                    onClick={handleClick}
                  >
                    {item?.name || item?.title}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default SearchResult;
