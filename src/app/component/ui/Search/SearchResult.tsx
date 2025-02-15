"use client";

import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  fetchMultiSearch,
  fetchPopularSearch,
} from "@/app/actions/fetchMovieApi";
import type { SearchResultItem } from "./SearchInput";
import { FaUser } from "react-icons/fa6";
import { PiTelevisionDuotone } from "react-icons/pi";
import { MdLocalMovies } from "react-icons/md";
import { RiHistoryFill } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface SearchResultProps {
  query: string;
  debouncedSearchQuery: string;
  onResultSelect: (item: SearchResultItem) => void;
  onSearch: (query: string) => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  query,
  debouncedSearchQuery,
  onResultSelect,
  onSearch,
}) => {
  const router = useRouter();
  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchResults", debouncedSearchQuery],
    queryFn: () => fetchMultiSearch(debouncedSearchQuery),
    staleTime: 3600000,
    gcTime: 3600000,
    refetchOnWindowFocus: true,
    enabled: debouncedSearchQuery.length > 0,
  });

  const { data: popular_search } = useQuery({
    queryKey: ["popular_search"],
    queryFn: () => fetchPopularSearch(),
    staleTime: 3600000,
    gcTime: 3600000,
    refetchOnWindowFocus: true,
    enabled: debouncedSearchQuery.length === 0,
  });

  const displayResults = query ? results : popular_search;

  const handleItemClick = (item: SearchResultItem) => {
    const itemName = item.title || item.name || "";

    switch (item.media_type) {
      case "movie":
        router.push(`/movie/${item.id}-${spaceToHyphen(itemName)}`);
        break;
      case "tv":
        router.push(`/tv/${item.id}-${spaceToHyphen(itemName)}`);
        break;
      case "person":
        router.push(`/person/${item.id}-${spaceToHyphen(itemName)}`);
        break;
      default:
        onResultSelect(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-x-0 top-full"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-md shadow-lg overflow-hidden">
          <div className="py-2">
            <h3 className="text-gray-400 text-sm px-4 py-2">
              {query ? "Search Results" : "Popular Searches"}
            </h3>
            <ScrollArea className="divide-y divide-gray-800 h-[90vh]">
              {isLoading ? (
                <div className="px-4 py-3 text-gray-400">Searching...</div>
              ) : isError ? (
                <div className="px-4 py-3 text-gray-400">
                  Error fetching results
                </div>
              ) : displayResults && displayResults.length > 0 ? (
                displayResults.map((item: SearchResultItem, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <button
                      className="flex items-center px-4 py-3 hover:bg-gray-800/50 transition-colors w-full text-left"
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="text-green-500 text-sm font-medium w-6">
                        {index + 1}
                      </span>
                      <span className="text-white group-hover:text-green-500 transition-colors">
                        {item.title || item.name}
                      </span>
                      <span className="text-gray-400 text-sm ml-auto">
                        {item?.media_type === "person" ? (
                          <FaUser size={13} />
                        ) : item?.media_type === "tv" ? (
                          <PiTelevisionDuotone size={13} />
                        ) : item?.media_type === "movie" ? (
                          <MdLocalMovies size={13} />
                        ) : (
                          <RiHistoryFill size={20} />
                        )}
                      </span>
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400">No results found</div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResult;
