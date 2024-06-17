"use client";

import {
  fetchCollectionSearch,
  fetchMovieSearch,
  fetchPersonSearch,
  fetchTvSearch,
} from "@/app/actions/fetchMovieApi";
import Results from "@/app/component/ui/Search/Results";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { SearchPagination } from "../Pagination/SearchPagination";

const SearchQuery = ({ BASE_URL, currentUser }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const currentPage = parseInt(searchParams?.get("page") || "1");

  let searchQuery = searchParams?.get("query") ?? "";

  const fetchMultipleSearch = async (pages = 1) => {
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
  };

  const getTotalResults = async (pages = 1) => {
    const res = await fetch(
      `${BASE_URL}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&page=${pages}`
    );

    const data = await res.json();
    return data;
  };

  const { data: totalResults } = useQuery({
    queryKey: ["totalResults", searchQuery],
    queryFn: () => getTotalResults(currentPage),
    placeholderData: keepPreviousData,
  });

  const { data: results } = useQuery({
    queryKey: ["results", searchQuery],
    queryFn: () => fetchMultipleSearch(currentPage),
    placeholderData: keepPreviousData,
  });

  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = totalResults?.total_results;
  const totalItems = results?.slice(start, end);

  const { data: fetchTv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTvSearch(searchQuery),
  });

  const { data: fetchMovie } = useQuery({
    queryKey: ["movie"],
    queryFn: () => fetchMovieSearch(searchQuery),
  });

  const { data: fetchPersons } = useQuery({
    queryKey: ["person"],
    queryFn: () => fetchPersonSearch(searchQuery),
  });

  const { data: fetchCollection } = useQuery({
    queryKey: ["collection"],
    queryFn: () => fetchCollectionSearch(searchQuery),
  });

  return (
    <div className="mt-10">
      {totalItems?.length === 0 && (
        <h1 className="text-center pt-6">No results found</h1>
      )}
      {totalItems?.length > 0 && (
        <>
          <Suspense fallback="Loading...">
            <Results
              items={items}
              results={totalItems}
              searchQuery={searchQuery}
              fetchMovie={fetchMovie}
              fetchTv={fetchTv}
              fetchCollection={fetchCollection}
              fetchPersons={fetchPersons}
              BASE_URL={BASE_URL}
              searchParams={searchParams}
              currentUser={currentUser}
            />
          </Suspense>
          <div className="flex flex-wrap items-start justify-start max-w-[1520px] mx-auto pb-10">
            <Suspense fallback="Loading...">
              <SearchPagination setPage={setPage} totalItems={items} />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchQuery;
