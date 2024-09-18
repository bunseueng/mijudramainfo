"use client";

import {
  fetchCollectionSearch,
  fetchMovieSearch,
  fetchPersonSearch,
  fetchTvSearch,
} from "@/app/actions/fetchMovieApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { SearchPagination } from "../Pagination/SearchPagination";
import dynamic from "next/dynamic";
const Results = dynamic(() => import("@/app/component/ui/Search/Results"));
const SearchLoading = dynamic(() => import("../Loading/SearchLoading"), {
  ssr: false,
});

const SearchQuery = ({ BASE_URL, currentUser }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const currentPage = parseInt(searchParams?.get("page") || "1");

  let searchQuery = searchParams?.get("query") ?? "";

  const fetchMultipleSearch = async (pages = 1) => {
    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&page=${pages}`
      );
      const countryUrl = await fetch(
        `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
      );
      const data = await res.json();
      const countryRes = await countryUrl.json();
      // Function to determine country type for an item
      const determineCountryType = (item: any, countryData: any) => {
        const originCountries = item.origin_country || [];
        const countryNames = originCountries.map((countryCode: string) => {
          const country = countryData.find(
            (c: any) => c.iso_3166_1 === countryCode
          );
          return country ? country.english_name : countryCode;
        });
        return countryNames.join(" ");
      };

      // Add countryType field to each item in results
      const resultsWithCountryType = data.results.map((item: any) => ({
        ...item,
        country: determineCountryType(item, countryRes),
      }));

      return resultsWithCountryType;
    } catch (error: any) {
      console.log(error, "Failed to fetch");
    }
  };

  const getTotalResults = async (pages = 1) => {
    try {
      const res = await fetch(
        `${BASE_URL}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&page=${pages}`
      );

      const data = await res.json();
      return data;
    } catch (error: any) {
      console.log(error, "Failed to fetch");
    }
  };

  const { data: totalResults } = useQuery({
    queryKey: ["totalResults", searchQuery],
    queryFn: () => getTotalResults(currentPage),
    placeholderData: keepPreviousData,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["results", searchQuery],
    queryFn: () => fetchMultipleSearch(currentPage),
    placeholderData: keepPreviousData,
  });

  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = totalResults?.total_results;
  const totalItems = results?.slice(start, end);

  const fetchAllSearchResults = async (pages = 1) => {
    try {
      const [tv, movie, person, collection] = await Promise.all([
        fetchTvSearch(searchQuery),
        fetchMovieSearch(searchQuery),
        fetchPersonSearch(searchQuery),
        fetchCollectionSearch(searchQuery),
      ]);

      return { tv, movie, person, collection };
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  };

  const { data: combinedData } = useQuery({
    queryKey: ["results", searchQuery, currentPage],
    queryFn: () => fetchAllSearchResults(currentPage),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="min-h-screen mt-10">
      {totalItems?.length === 0 && (
        <h1 className="h-screen text-xl text-center mt-20">No results found</h1>
      )}
      {totalItems?.length > 0 && (
        <Suspense fallback={<SearchLoading />}>
          <Results
            items={items}
            results={totalItems}
            searchQuery={searchQuery}
            fetchMovie={combinedData?.movie}
            fetchTv={combinedData?.tv}
            fetchCollection={combinedData?.collection}
            fetchPersons={combinedData?.person}
            BASE_URL={BASE_URL}
            searchParams={searchParams}
            currentUser={currentUser}
          />
          <div className="flex flex-wrap items-start justify-start max-w-6xl mx-auto px-1 md:px-2 pb-10">
            <SearchPagination
              setPage={setPage}
              totalItems={items}
              per_page={per_page as string}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default SearchQuery;
