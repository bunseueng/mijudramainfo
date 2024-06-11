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
import SearchLoading from "../Loading/SearchLoading";

const SearchQuery = ({ BASE_URL, currentUser }: any) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams(); // Assuming you have this declared somewhere
  const currentPage = parseInt(searchParams.get("page") || "1");

  let searchQuery = searchParams.get("query") ?? "";

  const fetchMultiSearch = async (pages = 1) => {
    const res = await fetch(
      `${BASE_URL}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&language=en-US&page=${pages}`
    );
    const data = await res.json();
    return data;
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ["results", searchQuery],
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

  if (isLoading) {
    return <SearchLoading />;
  }
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
            searchParams={searchParams}
            currentUser={currentUser}
          />
          <div className="flex flex-wrap items-start justify-start max-w-[1520px] mx-auto pb-10">
            <SearchPagination setPage={setPage} totalItems={items} />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchQuery;
