"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import {
  FilterParams,
  getCountries,
  getGenres,
  getPopularByParams,
} from "@/app/actions/fetchMovieApi";
import { cn } from "@/lib/utils";
import AdArticle from "@/app/component/ui/Adsense/AdArticle";
import { WatchImage } from "./WatchImage";

const sortOptions = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "first_air_date.desc", label: "Newest First" },
  { value: "first_air_date.asc", label: "Oldest First" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
];

interface WatchTvProps {
  title: string;
  type: string;
  genre: string;
}

const WatchCard = ({ title, type, genre }: WatchTvProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    sort_by: "popularity.desc",
    with_genres: genre,
    with_origin_country: "CN",
    "first_air_date.gte": "",
    "first_air_date.lte": "",
  });

  const { data: genres } = useQuery({
    queryKey: [`${type}_genres`],
    queryFn: () => getGenres(type),
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`"popular_${type}_watch"`, filters, currentPage],
    queryFn: () => getPopularByParams(type, { ...filters, page: currentPage }),
  });

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleFilterChange = (name: keyof FilterParams, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    if (!data) return [];
    const totalPages = Math.min(data.total_pages, 500);
    const current = currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (current > 3) pages.push("...");

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(current + 1, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    if (current < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading {type}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1788px] mx-auto px-4 py-8">
      {" "}
      <div className="hidden md:block w-full h-[200px] bg-gray-200 dark:bg-black mb-10 order-first">
        <AdArticle dataAdFormat="auto" dataAdSlot="3527489220" />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors mt-4 md:mt-0"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Sort By</label>
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Genre</label>
            <select
              value={filters.with_genres}
              onChange={(e) =>
                handleFilterChange("with_genres", e.target.value)
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres?.genres.map((genre: any) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Country</label>
            <select
              value={filters.with_origin_country}
              onChange={(e) =>
                handleFilterChange("with_origin_country", e.target.value)
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries?.map((country: any) => (
                <option key={country.iso_3166_1} value={country.iso_3166_1}>
                  {country.english_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Air Date From</label>
            <input
              type="date"
              value={filters["first_air_date.gte"]}
              onChange={(e) =>
                handleFilterChange("first_air_date.gte", e.target.value)
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Air Date To</label>
            <input
              type="date"
              value={filters["first_air_date.lte"]}
              onChange={(e) =>
                handleFilterChange("first_air_date.lte", e.target.value)
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  page: 1,
                  sort_by: "popularity.desc",
                  with_genres: genre,
                  with_origin_country: "CN",
                  "first_air_date.gte": "",
                  "first_air_date.lte": "",
                });
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.results.map((show: any) => (
          <WatchImage key={show.id} {...show} type={type} />
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => (
            <React.Fragment key={idx}>
              {pageNum === "..." ? (
                <span className="px-3 py-2">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(Number(pageNum))}
                  className={cn(
                    "min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors",
                    currentPage === pageNum
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                  )}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() =>
            handlePageChange(
              Math.min(currentPage + 1, Math.min(data.total_pages, 500))
            )
          }
          disabled={currentPage === Math.min(data.total_pages, 500)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>{" "}
      <div className="w-full h-[200px] bg-gray-200 dark:bg-black my-10 order-first">
        <AdArticle dataAdFormat="auto" dataAdSlot="3527489220" />
      </div>
    </div>
  );
};

export default WatchCard;
