"use client";

import { fetchCompany } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import SearchLoading from "../Loading/SearchLoading";

const NetworkFilter = ({
  searchParams,
  setSearchQueryKeyword,
  searchQueryKeyword,
  router,
  showResult,
  setShowResult,
  pathname,
}: any) => {
  const queries = searchParams.get("q") ?? "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const onInput = (e: any) => {
    const { name, value } = e.target;
    if (name === "searchQueryKeyword") {
      setSearchQueryKeyword(value);
    }
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    e.preventDefault();
    router.push(`${pathname}/?${params.toString()}`, {
      scroll: false,
    });
  };

  const { data: networks, isLoading } = useQuery({
    queryKey: ["networks", queries, currentPage],
    queryFn: () => fetchCompany(queries, currentPage),
  });

  const addToSelectedResults = (itemName: any, key: any, value: any) => {
    setShowResult([...showResult, itemName]);
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split("|") : [];

    if (values.includes(value)) {
      values = values.filter((v) => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join("|");
    }

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
    setSearchQueryKeyword("");
  };

  const handleCloseResult = (index: number) => {
    const updatedResult = [...showResult];
    updatedResult.splice(index, 1);
    setShowResult(updatedResult);

    const params = new URLSearchParams(searchParams);
    const keywords = params.get("networks");
    if (keywords) {
      const keywordArray = keywords.split("|");
      keywordArray.splice(index, 1);
      params.set("networks", keywordArray.join("|"));
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
          id="networks"
          name="searchQueryKeyword"
          type="text"
          placeholder="Search for networks"
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
      {/* Use AnimatePresence around the motion.div */}
      <AnimatePresence>
        {networks?.results?.length > 0 && (
          <motion.div
            className="text-black dark:text-white bg-white dark:bg-[#242526] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] rounded-md my-2 cursor-pointer flex flex-col h-[200px] overflow-y"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {networks?.results?.map((item: any) => {
              const capitalizedName = item?.name
                ?.split(" ")
                .map(
                  (word: any) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ");
              return (
                <div
                  key={item.id}
                  className="text-black dark:text-white hover:bg-[#00000011] dark:hover:bg-[#3a3b3c] transform duration-300 px-5 py-3"
                  onClick={() =>
                    addToSelectedResults(capitalizedName, "networks", item.id)
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

export default NetworkFilter;
