"use client";

import {
  countryCheckbox1,
  genreCheckbox,
  genreCheckbox2,
  sortCheckbox,
  starLabels,
  statusCheckbox,
  typeCheckbox1,
  typeCheckbox2,
} from "@/helper/item-list";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Slider } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { SearchParamsType } from "@/helper/type";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
const NetworkFilter = dynamic(
  () => import("@/app/component/ui/Search/NetworkFilter"),
  { ssr: false }
);
const TagResult = dynamic(() => import("./TagResult"), { ssr: false });

const DramaFilter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryKeyword, setSearchQueryKeyword] = useState("");
  const [openDrop, setOpenDrop] = useState("");
  const [showResult, setShowResult] = useState([]);
  const [selectedYear, setSelectedYear] = useState<number[]>([1890, 2035]);
  const [selectedRating, setSelectedRating] = useState<number[]>([1, 10]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const country = searchParams?.get("country") ?? "";
  const genre = searchParams?.get("genre") ?? "";
  const type = searchParams?.get("type") ?? "";
  const network = searchParams?.get("networks") ?? "";
  const date = searchParams?.get("date") ?? "";
  const rating = searchParams?.get("rating") ?? "";
  const status = searchParams?.get("status") ?? "";
  const sortby = searchParams?.get("sortby") ?? "";
  const query = searchParams?.get("query") ?? "";
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const onInput = (e: any) => {
    const { name, value } = e.target;
    if (name === "searchQuery") {
      setSearchQuery(value);
    } else if (name === "searchQueryKeyword") {
      setSearchQueryKeyword(value);
    }
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    router.push(`${pathname}/?${params.toString()}`, {
      scroll: false,
    });
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    if (type === "movie") {
      router.push(`/search/type/movie?${params.toString()}`);
    } else if (type === "tv") {
      router.push(`/search/type/tv?${params.toString()}`);
    } else if (type === "tvShows") {
      router.push(`/search/type/tvShow?${params.toString()}`);
    } else if (country) {
      router.push(`/search/country?${params.toString()}`);
    } else if (genre) {
      router.push(`/search/genre?${params.toString()}`);
    } else if (network) {
      router.push(`/search/network?${params.toString()}`);
    } else if (date) {
      router.push(`/search/date?${params.toString()}`);
    } else if (rating) {
      router.push(`/search/rating?${params.toString()}`);
    } else {
      router.push(`/search/?${params.toString()}`);
    }
  };

  const inputCheckbox = (key: any, value: any) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
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
  };

  const handleCheckboxChange =
    (key: string, value: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      inputCheckbox(key, value);
    };

  const selectBox = (key: any, value: any) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    values = [value];

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
  };

  const toggleDropdown = (name: string) => {
    setOpenDrop(openDrop === name ? "" : name);
  };

  const handleChange = (event: any, newValue: number | number[]) => {
    const newYearRange = Array.isArray(newValue) ? newValue : selectedYear;
    setSelectedYear(newYearRange);

    const from = newYearRange[0];
    const to = newYearRange[1];

    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    params.set("date", from.toString());
    params.set("to", to.toString());

    const newUrl = `${pathname}/?${params.toString()}`;

    router.push(newUrl, { scroll: false });
  };

  const handleChangeRating = (event: any, newValue: number | number[]) => {
    const newRatingRange = Array.isArray(newValue) ? newValue : selectedRating;
    setSelectedRating(newRatingRange);

    const from = newRatingRange[0];
    const rto = newRatingRange[1];

    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    params.set("rating", from.toString());
    params.set("rto", rto.toString());

    const newUrl = `${pathname}/?${params.toString()}`;

    router.push(newUrl, { scroll: false });
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence>
      <form className="" onSubmit={onSearch}>
        <div className="relative flex">
          <input
            type="search"
            name="searchQuery"
            className="w-[20%] md:ml-1 lg:ml-4 my-4 block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-1 lg:px-3 py-3 text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
            placeholder="Search"
            onChange={onInput}
            value={searchQuery}
          />
          <button
            className="z-[2] rounded-e border-2 border-primary px-1 lg:px-6 my-4 md:mr-1 lg:mr-4 text-xs uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
            type="submit"
          >
            Search
          </button>
        </div>
        <div className="bg-cyan-100 dark:bg-[#1e1e1e] relative">
          <h1 className="text-lg font-bold p-4">Advanced Filter</h1>
          <ul className="flex items-center">
            <li className="bg-white dark:bg-[#242424] dark:text-[#2196f3] text-lg font-semibold border-t-2 border-x-2 rounded-t-md mx-4 px-2 cursor-pointer">
              Titles
            </li>
            <li className="bg-white dark:bg-[#242424] dark:text-[#2196f3] text-lg font-semibold border-t-2 border-x-2 rounded-t-md mx-4 px-2">
              People
            </li>
          </ul>
        </div>
        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("type")}
            >
              Type
              <IoIosArrowDown />
            </b>
          </div>

          <motion.div
            className={`mx-4 ${openDrop === "type" ? "block" : "hidden"}`}
            initial="hidden"
            animate={openDrop === "type" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="grid grid-cols-2 border-0">
              <ul className="py-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {typeCheckbox1?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.value}
                        checked={type.split(",").includes(item.value)}
                        onChange={handleCheckboxChange("type", item.value)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.label}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
              <ul className="py-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {typeCheckbox2?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.value}
                        checked={type.split(",").includes(item.value)}
                        onChange={handleCheckboxChange("type", item.value)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.label}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("country")}
            >
              Country
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "country" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "country" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="grid grid-cols-2">
              <ul className="py-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {countryCheckbox1?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.value}
                        checked={country.split(",").includes(item.value)}
                        onChange={handleCheckboxChange("country", item.value)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.label}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("genres")}
            >
              Genres
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "genres" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "genres" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="grid grid-cols-2">
              <ul className="py-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {genreCheckbox?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.id}
                        checked={genre.split(",").includes(item.id)}
                        onChange={handleCheckboxChange("genre", item.id)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.value}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
              <ul className="py-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {genreCheckbox2?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.id}
                        checked={genre.split(",").includes(item.id)}
                        onChange={handleCheckboxChange("genre", item.id)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.value}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("keywords")}
            >
              Keywords
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "keywords" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "keywords" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="my-2 relative">
              <Suspense fallback={<div>Loading...</div>}>
                <TagResult
                  searchParams={searchParams}
                  setSearchQueryKeyword={setSearchQueryKeyword}
                  searchQueryKeyword={searchQueryKeyword}
                  router={router}
                  pathname={pathname}
                  showResult={showResult}
                  setShowResult={setShowResult}
                />
              </Suspense>
            </div>
          </motion.div>
        </div>
        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("network")}
            >
              Networks
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "network" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "network" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="my-2 relative">
              <Suspense fallback={<div>Loading...</div>}>
                <NetworkFilter
                  searchParams={searchParams}
                  setSearchQueryKeyword={setSearchQueryKeyword}
                  searchQueryKeyword={searchQueryKeyword}
                  router={router}
                  pathname={pathname}
                  showResult={showResult}
                  setShowResult={setShowResult}
                />
              </Suspense>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("date")}
            >
              Release Date
              <IoIosArrowDown />
            </b>
          </div>

          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "date" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "date" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Slider
                value={selectedYear}
                onChange={handleChange}
                min={1980}
                max={2035}
                step={1}
                sx={{
                  height: 10,
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#3498db",
                    color: "#ffffff",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  },
                }}
                valueLabelDisplay="on"
              />
            </Suspense>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("rating")}
            >
              Rating
              <IoIosArrowDown />
            </b>
          </div>

          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "rating" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "rating" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Slider
                value={selectedRating}
                onChange={handleChangeRating}
                min={1}
                max={10}
                step={0.5}
                sx={{
                  height: 10,
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "transparent",
                    color: "#000",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    position: "relative",
                    marginTop: "25px",
                    "&::before": {
                      content: "''",
                      position: "absolute",
                      top: "-20px",
                      left: "33%",
                      width: "20px",
                      height: "20px",
                      background: "url(/star.png)",
                      backgroundSize: "cover",
                      transform: "rotate(0deg)",
                    },
                  },
                  "& .MuiSlider-markLabel": {
                    color: "rgb(52, 152, 219)",
                  },
                }}
                marks={starLabels}
                valueLabelDisplay="on"
              />
            </Suspense>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("status")}
            >
              Status
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "status" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "status" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <div className="grid grid-cols-2">
              <ul className="pb-3 space-y-3 text-sm text-[#2196f3] dark:text-gray-200 ">
                {statusCheckbox?.map((item: any, idx: number) => (
                  <li key={idx}>
                    <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center">
                      <input
                        type="checkbox"
                        value={item.id}
                        checked={status.split(",").includes(item.id)}
                        onChange={handleCheckboxChange("status", item.id)}
                        className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                      />
                      <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                        {item?.value}
                      </span>
                      <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-b-slate-300">
          <div className="p-4">
            <b
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("sort")}
            >
              Sort by
              <IoIosArrowDown />
            </b>
          </div>
          <motion.div
            className={`mx-4 divide-y ${
              openDrop === "sort" ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={openDrop === "sort" ? "visible" : "hidden"}
            variants={dropdownVariants}
          >
            <select
              name="sort"
              id="sort"
              className="border border-slate-400 rounded-md px-4 py-2 mb-4"
              onChange={(e) => selectBox("sortby", e.target.value)}
            >
              {sortCheckbox?.map((item: any, idx: number) => (
                <option value={item.id} key={idx}>
                  {item.value}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
        <div className="">
          <div className="flex items-center justify-between p-4">
            <button
              type="submit"
              className="bg-[#1675b6] text-white border border-[#1f6fa7] rounded-md px-4 py-2"
            >
              Search
            </button>
            <button
              type="submit"
              className="bg-white dark:bg-[#3a3b3c] border border-[#cdcdcd] dark:border-[#3e4042] rounded-md px-4 py-2"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </AnimatePresence>
  );
};

export default DramaFilter;
