"use client";

import Link from "next/link";
import Card from "../Card/Card";
import Person from "../Fetching/Person";
import { Suspense } from "react";
import SearchLoading from "../Loading/SearchLoading";

export default function Results({
  results,
  items,
  searchQuery,
  searchParams,
  fetchMovie,
  fetchTv,
  BASE_URL,
  fetchCollection,
  fetchPersons,
  currentUser,
}: any) {
  const path = BASE_URL.split("/").pop();
  return (
    <div className="flex flex-col items-start justify-start max-w-[1520px] mx-auto py-4 overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-[77.7777%] float-left px-1 md:px-4">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">Search</h1>
            <p>{items} results</p>
          </div>
          <div className="h-full w-full p-2 overflow-hidden">
            {results?.map((result: any, idx: number) => (
              <div
                className="grid grid-cols-1 bg-white dark:bg-[#242424] border-2 dark:border-[#272727] rounded-lg mb-4"
                key={idx}
              >
                {!result.gender && !result.known_for ? (
                  <Suspense fallback={<SearchLoading />}>
                    <Card
                      key={idx}
                      result={result}
                      searchQuery={searchQuery}
                      BASE_URL={BASE_URL}
                    />
                  </Suspense>
                ) : (
                  <Suspense fallback={<SearchLoading />}>
                    <Person
                      key={idx}
                      result={result}
                      searchQuery={searchQuery}
                      BASE_URL={BASE_URL}
                      currentUser={currentUser}
                    />
                  </Suspense>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-[33.3333%] float-right">
          <div className="border rounded-lg border-slate-400 dark:border-[#272727]">
            <div className="px-10 py-5 bg-cyan-400 dark:bg-[#272727] rounded-t-lg">
              <h2 className="text-center font-bold uppercase text-white">
                Search Results
              </h2>
            </div>
            <div className="flex flex-col items-center dark:bg-[#242424]">
              <ul className="list w-full">
                <li className="py-2 relative nav text-start">
                  <Link
                    href={`/search/tv/?query=${searchQuery}`}
                    className={`pl-2 pt-3 ${path ? "item" : ""}`}
                  >
                    <div className="flex items-center justify-between dark:text-white">
                      Tv Show
                      {path === "tv" ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {items}
                        </div>
                      ) : null}
                      {searchParams ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {fetchTv?.total_results}
                        </div>
                      ) : (
                        <div
                          className={`bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2 ${
                            path === "tv" ? "hidden" : "block"
                          }`}
                        >
                          0
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
                <li className="py-2 relative nav text-start">
                  <Link
                    href={`/search/movie/?query=${searchQuery}`}
                    className="item pl-2 pt-3"
                  >
                    <div className="flex items-center justify-between dark:text-white">
                      Movie
                      {path === "movie" ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {items}
                        </div>
                      ) : null}
                      {searchParams ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {fetchMovie?.total_results}
                        </div>
                      ) : (
                        <div
                          className={`bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2 ${
                            path === "movie" ? "hidden" : "block"
                          }`}
                        >
                          0
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
                <li className="py-2 relative nav text-start">
                  <Link
                    href={`/search/collection/?query=${searchQuery}`}
                    className="item pl-2 pt-3"
                  >
                    <div className="flex items-center justify-between dark:text-white">
                      Collection
                      {path === "collection" ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {items}
                        </div>
                      ) : null}
                      {searchParams ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {fetchCollection?.total_results}
                        </div>
                      ) : (
                        <div
                          className={`bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2 ${
                            path === "collection" ? "hidden" : "block"
                          }`}
                        >
                          0
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
                <li className="py-2 relative nav text-start">
                  <Link
                    href={`/search/person/?query=${searchQuery}`}
                    className="item pl-2 pt-3"
                  >
                    <div className="flex items-center justify-between dark:text-white">
                      Person
                      {path === "person" ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {items}
                        </div>
                      ) : null}
                      {searchParams ? (
                        <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2">
                          {fetchPersons?.total_results}
                        </div>
                      ) : (
                        <div
                          className={`bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2 ${
                            path === "person" ? "hidden" : "block"
                          }`}
                        >
                          0
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
