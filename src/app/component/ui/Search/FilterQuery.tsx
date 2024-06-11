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
import React, { useState } from "react";
import { SearchPagination } from "../Pagination/SearchPagination";
import moment from "moment";

const FilterQuery = ({ BASE_URL }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const currentPage = parseInt(searchParams.get("page") || "1");
  let searchQuery = searchParams.get("country") ?? "";
  let type = searchParams.get("type") ?? "";
  let genreQuery = searchParams.get("genre") ?? "";
  let keywords = searchParams.get("keywords") ?? "";
  let network = searchParams.get("networks") ?? "";
  let date = searchParams.get("date") ?? "";
  let to = searchParams.get("to") ?? "";
  let rating = searchParams.get("rating") ?? "";
  let rto = searchParams.get("rto") ?? "";
  let status = searchParams.get("status") ?? "";
  let sortby = searchParams.get("sortby") ?? "";
  // Get the current date
  const currentDate = moment();

  // Subtract 7 days from the current date
  const sevenDaysAgo = currentDate.subtract(7, "days");

  // Format the date if needed
  const formattedDate = sevenDaysAgo.format("YYYY-MM-DD");

  const fetchMultiSearch = async (pages = 1) => {
    let url = `${BASE_URL}?api_key=${
      process.env.NEXT_PUBLIC_API_KEY
    }&language=en-US&with_origin_country=${encodeURIComponent(searchQuery)}`;

    // Check if date and to variables are defined before adding them to the URL
    if (date && to) {
      url += `&first_air_date.gte=${date}-01-01&first_air_date.lte=${to}-12-31`;
    } else if (sortby === "formattedDate") {
      url += `&air_date.gte=${formattedDate}`;
    }

    // Add genre 10764 (Reality) only if the query type is "tvShows"
    if (type === "tvShows") {
      url += "&with_genres=10764"; // Add the Reality genre
    } else {
      url += !genreQuery
        ? "&without_genres=16,10764,10767,99"
        : `&with_genres=${genreQuery}`;
    }

    url += `&with_keywords=${keywords}&with_networks=${network}&vote_average.gte=${rating}&vote_average.lte=${rto}&with_status=${status}&sortby=${sortby}&page=${pages}`;

    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  const { data: results } = useQuery({
    queryKey: ["results", currentPage],
    queryFn: () => fetchMultiSearch(currentPage),
    placeholderData: keepPreviousData,
  });

  const per_page = searchParams.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const items = results?.total_results;
  const totalItems = results?.results?.slice(start, end);

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
    <div>
      {totalItems?.length === 0 && (
        <h1 className="text-center pt-6">No results found</h1>
      )}
      {totalItems?.length > 0 && (
        <>
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
          <div className="flex flex-col items-start justify-start max-w-[1520px] mx-auto pb-10">
            <SearchPagination setPage={setPage} totalItems={items} />
          </div>
        </>
      )}
    </div>
  );
};

export default FilterQuery;
