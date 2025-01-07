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
  return (
    <>
      {results?.length === 0 ? (
        <div className="absolute w-full bg-white bg-opacity-20 shadow-lg max-h-96 overflow-y-auto backdrop-blur-lg custom-scrollbar">
          <div className="relative">
            <div className="absolute inset-0 bg-white opacity-10 blur-xl rounded-2xl"></div>
            <div className="relative z-10">
              <div className="max-w-6xl mx-auto relative">
                <div className="h-screen p-8">
                  <p className="text-black text-center text-3xl uppercase font-semibold px-14 py-1 cursor-pointer hover:opacity-70 duration-300 truncate">
                    No Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute w-full bg-white bg-opacity-10 shadow-lg max-h-96 overflow-y-auto backdrop-blur-lg custom-scrollbar">
          <div className="relative">
            <div className="absolute inset-0 bg-white opacity-5 blur-xl "></div>
            <div className="relative z-10">
              {showResults &&
                results?.map((item: any, idx: number) => (
                  <div
                    className="px-6 py-4 hover:bg-white hover:bg-opacity-30 cursor-pointer transition-colors duration-150"
                    key={idx}
                  >
                    <div className="max-w-6xl mx-auto relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pl-3 pointer-events-none">
                        {item?.media_type === "person" ? (
                          <FaUser size={13} />
                        ) : item?.media_type === "tv" ? (
                          <PiTelevisionDuotone size={13} />
                        ) : item?.media_type === "movie" ? (
                          <MdLocalMovies size={13} />
                        ) : (
                          <RiHistoryFill size={20} />
                        )}
                      </div>
                      <Link
                        href={`/search/?${params.toString()}`}
                        className="text-white font-semibold px-14 py-1 cursor-pointer hover:opacity-70 duration-300 truncate"
                        onClick={handleClick}
                      >
                        {item?.name || item?.title}
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResult;
