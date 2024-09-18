"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import dynamic from "next/dynamic";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const TagResult = ({
  searchParams,
  setSearchQueryKeyword,
  searchQueryKeyword,
  router,
  showResult,
  setShowResult,
  pathname,
}: any) => {
  const queries = searchParams.get("query") ?? "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const onInput = (e: any) => {
    const { name, value } = e.target;
    // Update the corresponding state variable based on the input's name
    if (name === "searchQueryKeyword") {
      setSearchQueryKeyword(value);
    }
    const params = new URLSearchParams(searchParams);
    // Update the query parameter based on the input's name
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    e.preventDefault();
    router.push(`${pathname}/?${params.toString()}`, {
      scroll: false,
    });
  };

  const fetchMultiSearch = async (pages = 1) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${queries}&language=en-US&with_original_language=zh&region=CN&season&page=${pages}`
      );
      const data = await res.json();
      return data.results;
    } catch (error: any) {
      console.log("Failed to fetch", error);
    }
  };

  const { data: keyword, isLoading } = useQuery({
    queryKey: ["keywords", queries],
    queryFn: () => fetchMultiSearch(currentPage),
  });

  const addToSelectedResults = (itemName: any, key: any, value: any) => {
    setShowResult([...showResult, itemName]);
    // Update query parameter when adding a keyword
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    if (values.includes(value)) {
      values = values.filter((v) => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
    // Reset the searchQueryKeyword state to clear the input field
    setSearchQueryKeyword("");
  };

  const handleCloseResult = (index: number) => {
    // Create a copy of the showResult array
    const updatedResult = [...showResult];
    // Remove the result at the specified index
    updatedResult.splice(index, 1);
    // Update the showResult state with the modified array
    setShowResult(updatedResult);

    // Parse the current query parameters from the URL
    const params = new URLSearchParams(searchParams);
    // Get the value of the "keywords" parameter
    const keywords = params.get("keywords");
    if (keywords) {
      // Split the keywords string into an array
      const keywordArray = keywords.split(",");
      // Remove the keyword at the specified index
      keywordArray.splice(index, 1);
      // Update the "keywords" parameter with the modified array
      params.set("keywords", keywordArray.join(","));
      // Update the URL with the modified query parameters
      const queryString = params.toString();
      router.push(`${pathname}/?${queryString}`, {
        scroll: false,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap pb-2">
        {showResult.map((result: any, index: number) => (
          <div key={index}>
            <p className="flex items-center border text-white bg-green-400 px-2 py-1 rounded-md">
              {result}
              <span className="text-white ml-2 cursor-pointer">
                <IoCloseCircleSharp onClick={() => handleCloseResult(index)} />
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          id="keyword"
          name="searchQueryKeyword"
          type="text"
          placeholder="Search for keywords"
          className="w-full h-10 leading-10 placeholder:text-sm placeholder:text-[#606266] placeholder:opacity-60 text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:!ring-blue-500 focus:!border-blue-500 px-4"
          onChange={onInput}
          value={searchQueryKeyword}
        />
        <FaSearch className="absolute right-4 top-3 cursor-pointer" />
      </div>
      {isLoading && (
        <div
          className="flex items-center justify-center h-[100px] overflow-hidden mr-8 mb-4"
          style={{ zIndex: 2 }}
        >
          <SearchLoading />
        </div>
      )}
      <AnimatePresence>
        {keyword?.length > 0 && (
          <motion.div
            className="text-black dark:text-white bg-white dark:bg-[#242526] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] rounded-md my-2 cursor-pointer flex flex-col h-[200px] overflow-y"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {keyword?.map((item: any) => {
              // Split the name into words
              const words = item?.name?.split(" ");
              // Capitalize the first letter of each word
              const capitalizedWords = words?.map((word: any) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
              });
              // Join the words back together
              const capitalizedName = capitalizedWords?.join(" ");
              // Render the capitalized name
              return (
                <div
                  key={item.id}
                  className="text-black dark:text-white hover:bg-[#00000011] dark:hover:bg-[#3a3b3c] transform duration-300 px-5 py-3"
                  onClick={() =>
                    addToSelectedResults(capitalizedName, "keywords", item.id)
                  }
                >
                  {capitalizedName}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagResult;
