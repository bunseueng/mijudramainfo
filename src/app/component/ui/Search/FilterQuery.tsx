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
import moment from "moment";

const FilterQuery = ({ BASE_URL }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const currentPage = parseInt(searchParams?.get("page") || "1");
  let searchQuery = searchParams?.get("country") ?? "";
  let type = searchParams?.get("type") ?? "";
  let genreQuery = searchParams?.get("genre") ?? "";
  let keywords = searchParams?.get("keywords") ?? "";
  let company = searchParams?.get("networks") ?? "";
  let date = searchParams?.get("date") ?? "";
  let to = searchParams?.get("to") ?? "";
  let rating = searchParams?.get("rating") ?? "";
  let rto = searchParams?.get("rto") ?? "";
  let status = searchParams?.get("status") ?? "";
  let sortby = searchParams?.get("sortby") ?? "";
  // Get the current date
  const currentDate = moment();

  // Subtract 7 days from the current date
  const sevenDaysAgo = currentDate.subtract(7, "days");

  // Format the date if needed
  const formattedDate = sevenDaysAgo.format("YYYY-MM-DD");

  const fetchMultiSearch = async (pages = 1) => {
    try {
      // Initialize URLSearchParams
      const params = new URLSearchParams();

      // Add basic required parameters
      if (process.env.NEXT_PUBLIC_API_KEY) {
        params.append("api_key", process.env.NEXT_PUBLIC_API_KEY);
      }
      params.append("include_adult", "false");
      params.append("language", "en-US");
      params.append("page", pages.toString());

      // Append only if searchQuery is not empty
      if (searchQuery) {
        params.append("with_origin_country", searchQuery);
      }

      // Append date range only if both date and to are not empty
      if (date && to) {
        params.append("first_air_date.gte", `${date}-01-01`);
        params.append("first_air_date.lte", `${to}-12-31`);
      } else if (sortby === "formattedDate") {
        params.append("air_date.gte", formattedDate);
      }

      // Append type-specific and genre parameters
      if (type === "tvShows") {
        params.append("with_genres", "10764");
      } else if (genreQuery) {
        params.append("with_genres", genreQuery);
      } else {
        params.append("without_genres", "16,10764,10767,99");
      }

      // Append other parameters only if they are not empty
      if (keywords) params.append("with_keywords", keywords);
      if (company) {
        params.append("with_companies", company);
      }
      if (rating) params.append("vote_average.gte", rating);
      if (rto) params.append("vote_average.lte", rto);
      if (status) params.append("with_status", status);
      if (sortby) params.append("sortby", sortby);

      // Combine the base URL with the built query string
      const url = `${BASE_URL}?${params.toString()}`;

      console.log("Final URL:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data);

      return data;
    } catch (error: any) {
      console.error("Failed to fetch", error);
    }
  };

  const { data: results } = useQuery({
    queryKey: ["results", currentPage],
    queryFn: () => fetchMultiSearch(currentPage),
    placeholderData: keepPreviousData,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = results?.total_results;
  const totalItems = results?.results?.slice(start, end);

  const { data: fetchTv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTvSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: fetchMovie } = useQuery({
    queryKey: ["movie"],
    queryFn: () => fetchMovieSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: fetchPersons } = useQuery({
    queryKey: ["person"],
    queryFn: () => fetchPersonSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: fetchCollection } = useQuery({
    queryKey: ["collection"],
    queryFn: () => fetchCollectionSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  return (
    <div>
      {totalItems?.length === 0 && (
        <h1 className="text-center pt-6">No results found</h1>
      )}
      {totalItems?.length > 0 && (
        <Suspense fallback={<div>Loading...</div>}>
          <Results
            items={items}
            results={totalItems}
            searchQuery={searchQuery}
            fetchMovie={fetchMovie}
            fetchTv={fetchTv}
            fetchCollection={fetchCollection}
            fetchPersons={fetchPersons}
            BASE_URL={BASE_URL}
          />
          <div className="max-w-6xl relative flex flex-wrap items-center justify-between mx-auto px-2 my-7">
            <SearchPagination
              setPage={setPage}
              totalItems={items}
              per_page="20"
            />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default FilterQuery;
