"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchSharp, IoCloseCircle } from "react-icons/io5";
import useDebounce from "@/hooks/useDebounce";
import SearchResult from "./SearchResult";
import { useRouter } from "next/navigation";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

export interface SearchResultItem {
  id: number;
  name: string | null;
  title: string | null;
  media_type: string;
}

interface SearchInputProps {
  onClose: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmitSearch = (searchQuery: string = query) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitSearch(query);
  };

  const handleClearInput = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
    } else if (e.key === "Enter") {
      handleSubmitSearch(query);
    }
  };

  const handleResultSelect = (item: SearchResultItem) => {
    const itemName = spaceToHyphen(item.title || item.name || "");
    let route = "";

    switch (item.media_type) {
      case "movie":
        route = `/movie/${item.id}-${itemName}`;
        break;
      case "tv":
        route = `/tv/${item.id}-${itemName}`;
        break;
      case "person":
        route = `/person/${item.id}-${itemName}`;
        break;
      default:
        route = `/tv/${item.id}-${itemName}`;
    }

    router.push(route);
    onClose();
  };

  return (
    <div className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-2">
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="search-input" className="sr-only">
              Search for movies, TV shows, and more
            </label>
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              className={`w-full bg-gray-900/50 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 backdrop-blur-md ${
                isFocused ? "ring-2 ring-green-500" : ""
              }`}
              placeholder="Search for movies, TV shows, and more..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              aria-label="Search for movies, TV shows, and more"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchSharp
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            {query ? (
              <button
                type="button"
                onClick={handleClearInput}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <IoCloseCircle className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Close search"
              >
                <IoCloseCircle className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
              </button>
            )}
          </form>
        </div>
        <AnimatePresence>
          {(query || isFocused) && (
            <SearchResult
              query={query}
              debouncedSearchQuery={debouncedQuery}
              onResultSelect={handleResultSelect}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchInput;
