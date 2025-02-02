"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { production_country, production_language } from "@/helper/item-list";
import { Movie, movieId } from "@/helper/type";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { customStyles, lightTheme } from "@/helper/MuiStyling";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Loader2, RotateCcw } from "lucide-react";

const Production: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const { data: movie } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!movie_id,
  });

  const [database, setDatabase] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState<string[]>([]);
  const [originalLanguage, setOriginalLanguage] = useState<string[]>([]);
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const [originalCountries, setOriginalCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCountries, setOpenCountries] = useState<boolean>(false);
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>([]);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const initializeData = useCallback(() => {
    if (
      movieDetails?.production_information?.length &&
      movieDetails?.production_information?.length > 0
    ) {
      const productionInfo = movieDetails.production_information;
      setDatabase(productionInfo);

      // Set languages - Fix: Get the full language value instead of array
      const languages = productionInfo.map((info: any) => info?.language || "");
      setOriginalLanguage(languages);
      setLanguage(languages);

      // Set countries
      const countriesArray = productionInfo.flatMap(
        (info: any) =>
          info?.country?.map((c: any) => ({
            label: c.label,
            value: c.value,
          })) || []
      );
      setOriginalCountries(countriesArray);
      setCountries(countriesArray);
    } else if (movie) {
      setDatabase([movie]);

      // Initialize with movie data if available
      const defaultLanguage = movie?.original_language
        ? [
            production_language?.find(
              (l) => l.original === movie.original_language
            )?.value || "",
          ]
        : [""];
      setOriginalLanguage(defaultLanguage);
      setLanguage(defaultLanguage);

      const defaultCountries =
        movie?.production_countries?.map((c: any) => ({
          label: c.name,
          value: c.name,
        })) || [];
      setOriginalCountries(defaultCountries);
      setCountries(defaultCountries);
    }

    // Initialize isItemDataChanged array
    setIsItemDataChanged(
      new Array(movieDetails?.production_information?.length || 1).fill(false)
    );
  }, [movie, movieDetails?.production_information]);

  useEffect(() => {
    initializeData();
  }, [movieDetails, movie, initializeData]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setLanguages = (idx: number, role: string) => {
    setLanguage((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      return newRoles;
    });

    setIsItemDataChanged((prev) => {
      const newChanges = [...prev];
      newChanges[idx] = true;
      return newChanges;
    });
  };

  const changeHandler = (selectedOptions: any) => {
    setCountries(selectedOptions || []);
    setIsItemDataChanged((prev) => {
      const newChanges = [...prev];
      newChanges[0] =
        JSON.stringify(selectedOptions) !== JSON.stringify(originalCountries);
      return newChanges;
    });
  };

  const handleReset = () => {
    setLanguage(originalLanguage);
    setCountries(originalCountries);
    setIsItemDataChanged(new Array(database.length).fill(false));
    toast.info("Form has been reset");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/movie/${movie_id}/production`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie_id.toString(),
          production_information: [
            {
              language: language[0] || originalLanguage[0],
              country: countries,
            },
          ],
        }),
      });

      if (res?.status === 200) {
        toast.success("Success");
        router.refresh();
        setIsItemDataChanged(new Array(database.length).fill(false));
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = !isItemDataChanged.includes(true) || loading;

  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Production Information
      </h1>
      {database?.map((data, idx) => (
        <div className="text-left mb-4" key={idx}>
          <label htmlFor="origin_language" className="mb-3 mx-3">
            <b>Origin Language</b>
          </label>
          <div className="mx-3">
            <div className="relative">
              <div className="relative mt-2">
                <input
                  type="text"
                  name="job"
                  readOnly
                  autoComplete="off"
                  className="w-full placeholder:text-sm placeholder:text-black dark:placeholder:text-[#606266] dark:placeholder:opacity-60 text-black dark:text-white bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#c0c4cc] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-1.5 px-3 mt-1 cursor-pointer"
                  value={
                    language[idx] ||
                    originalLanguage[idx] ||
                    "Please select a language"
                  }
                  placeholder="Please select a language"
                  onClick={() => handleDropdownToggle("language", idx)}
                />
                <IoIosArrowDown className="absolute bottom-3 right-2" />
              </div>
              {openDropdown === `language-${idx}` && (
                <AnimatePresence>
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full h-[250px] absolute text-black dark:text-white bg-white dark:bg-[#242424] border-[1px] border-[#c0c4cc] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                  >
                    {production_language?.map((items, index) => {
                      const isSelected =
                        items.value ===
                        (language[idx] || originalLanguage[idx]);
                      return (
                        <li
                          key={index}
                          className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                            isSelected ? "text-[#409eff] dark:bg-[#2a2b2c]" : ""
                          }`}
                          onClick={() => {
                            handleDropdownToggle("language", idx);
                            setLanguages(idx, items.value);
                          }}
                        >
                          {items.value}
                        </li>
                      );
                    })}
                  </motion.ul>
                </AnimatePresence>
              )}
            </div>
          </div>
          <div className="mt-8">
            <label htmlFor="production_countries" className="mb-3 mx-3">
              <b>Production Countries</b>
            </label>
            <div
              className="mx-3"
              onClick={() => setOpenCountries(!openCountries)}
            >
              <Select
                isMulti
                options={production_country?.map((country) => ({
                  label: country.value,
                  value: country.value,
                }))}
                value={countries}
                onChange={changeHandler}
                styles={
                  resolvedTheme === "dark"
                    ? customStyles(openCountries)
                    : lightTheme(openCountries)
                }
                closeMenuOnSelect={false}
                classNamePrefix="react-select"
                menuIsOpen={openCountries}
                onBlur={() => setOpenCountries(false)}
                placeholder="Please enter a country name"
              />
            </div>
            <small className="text-muted-foreground opacity-60 ml-3">
              This is only for co-productions with 2 or more countries involved.
            </small>
          </div>
        </div>
      ))}
      <div className="border-t-2 border-t-[#78828c21] pt-5 mx-3">
        <div className="flex gap-3">
          <button
            name="submit"
            type="submit"
            className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
              isFormDisabled
                ? "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isFormDisabled}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-[1px] border-gray-300 dark:border-gray-700 px-5 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transform duration-300 rounded-md mb-10 ${
              isFormDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isFormDisabled}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default Production;
