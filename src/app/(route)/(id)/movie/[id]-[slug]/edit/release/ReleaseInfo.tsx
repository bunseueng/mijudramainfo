"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import {
  releaseDateByDay,
  releaseDateByMonth,
  releaseDateByYear,
} from "@/helper/item-list";
import { AddSeason, TVShow, Movie, movieId } from "@/helper/type";
import { JsonValue } from "@prisma/client/runtime/library";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowDown } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const ReleaseInfo: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const { data: movie = [] } = useQuery({
    queryKey: ["movie"],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [movieDatabase, setMovieDatabase] = useState<JsonValue[] | any>(
    movieDetails?.released_information
  );
  const [storedData, setStoredData] = useState<AddSeason[]>([]);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [drama, setDrama] = useState<any>([]);
  const [timeValue, setTimeValue] = useState([]);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});
  const router = useRouter();
  const mergeAndRemoveDuplicates = (
    array1: TVShow[],
    array2: TVShow[]
  ): TVShow[] => {
    const map = new Map<string, TVShow>();

    array1?.forEach((item: any) => map.set(item?.id, item));
    array2?.forEach((item: any) => map.set(item?.id, item));

    return Array.from(map.values());
  };
  const combinedData = mergeAndRemoveDuplicates(
    [movie],
    movieDatabase as any[]
  );
  useEffect(() => {
    const initialDrama =
      movieDatabase && movieDatabase.length > 0 ? movieDatabase : [movie];
    setDrama(initialDrama);
  }, [movie, movieDatabase]); // Remove storedData from dependencies

  const handleDropdownToggle = (dropdown: string, uniqueId: string) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}_${uniqueId}` ? null : `${dropdown}_${uniqueId}`
    );
  };
  const getMonthNameFromNumber = (monthNumber: string) => {
    const monthIndex = parseInt(monthNumber, 10);
    return releaseDateByMonth[monthIndex]?.label || "-";
  };

  const scrollIntoViewIfNeeded = (element: any) => {
    const rect = element?.getBoundingClientRect();
    const isVisible =
      rect?.top >= 0 &&
      rect?.left >= 0 &&
      rect?.bottom <=
        (window?.innerHeight || document?.documentElement?.clientHeight) &&
      rect?.right <=
        (window?.innerWidth || document?.documentElement.clientWidth);

    if (!isVisible) {
      element?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  const handleReset = () => {
    setSelectedValues({});
  };

  const renderDropdown = (
    items: { label: string; value: string }[],
    selected: string,
    dropdown: string,
    uniqueId: string,
    dramaLabel: string // Ensure drama array is passed down
  ) => (
    <AnimatePresence>
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full absolute text-black dark:text-white bg-white dark:bg-[#242424] border-[1px] border-[#f3f3f3] dark:border-[#242424]  py-1 mt-14 rounded-md z-10 custom-scroll overflow-auto shadow-md"
        style={
          dropdown === "episode" ? { height: "90px" } : { height: "200px" }
        }
      >
        {items.map((item, index) => {
          const isSelected =
            selected === item.label ? "text-[#409eff] dark:bg-[#ffffff11]" : "";
          const isMatched =
            selected === undefined && item.label === dramaLabel
              ? "text-[#409eff] dark:bg-[#ffffff11]"
              : "";
          return (
            <li
              key={index}
              ref={(el) => {
                if (isSelected || isMatched) {
                  scrollIntoViewIfNeeded(el);
                }
              }}
              className={`text-sm hover:bg-[#ffffff11] px-2 py-2 cursor-pointer ${isSelected} ${isMatched}`}
              onClick={() => {
                handleDropdownToggle(dropdown, uniqueId);
                handleDropdownSelect(dropdown, uniqueId, item.label);
              }}
            >
              <span className="pl-2">{item.label}</span>
            </li>
          );
        })}
      </motion.ul>
    </AnimatePresence>
  );

  const handleDropdownSelect = (
    type: string,
    uniqueId: string,
    value: string
  ) => {
    const key = `${type}_${uniqueId}`;
    setSelectedValues((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const extractMonthNumber = (month: string) => {
    // If month is in "MM - Month" format
    if (month?.includes(" - ")) {
      return month.split(" - ")[0];
    }

    // If month is just the month name, find its number
    const monthIndex = releaseDateByMonth.findIndex((m) => m.label === month);
    if (monthIndex !== -1) {
      return (monthIndex + 1).toString();
    }

    return month; // Return as is if it's already a number
  };

  // Function to combine month, day, and year
  const combineDate = (month: string, day: string, year: string) => {
    if (month === "-" || day === "-" || year === "-") {
      return `${year}-${month}-${day}`; // Return as is if any part is "-"
    }

    const formattedMonth = extractMonthNumber(month)?.padStart(2, "0");
    const formattedDay = day?.padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Get only the items that have changed release dates
      const changedItems = drama?.filter((item: any, idx: number) => {
        const releaseDate = {
          year: selectedValues[`year_release_${idx}`],
          day: selectedValues[`day_release_${idx}`],
          month: selectedValues[`month_release_${idx}`],
        };

        // If no values were selected, this item hasn't changed
        if (!releaseDate.year && !releaseDate.day && !releaseDate.month) {
          return false;
        }

        const currentDate = item.release_date?.split("-") || ["-", "-", "-"];
        const [currentYear, currentMonth, currentDay] = currentDate;

        // Compare with original values to check if anything changed
        const monthChanged =
          releaseDate.month &&
          extractMonthNumber(releaseDate.month) !== currentMonth;
        const dayChanged = releaseDate.day && releaseDate.day !== currentDay;
        const yearChanged =
          releaseDate.year && releaseDate.year !== currentYear;

        return monthChanged || dayChanged || yearChanged;
      });

      // Only process items that have changes
      const newReleaseInfo = changedItems?.map((item: any, idx: number) => {
        const currentDate = item.release_date?.split("-") || ["-", "-", "-"];
        const [currentYear, currentMonth, currentDay] = currentDate;

        const releaseDate = {
          year: selectedValues[`year_release_${idx}`],
          day: selectedValues[`day_release_${idx}`],
          month: selectedValues[`month_release_${idx}`],
        };

        // Only update fields that have actually changed
        const month = releaseDate.month || getMonthNameFromNumber(currentMonth);
        const day = releaseDate.day || currentDay;
        const year = releaseDate.year || currentYear;

        return {
          ...item,
          release_date: combineDate(month, day, year),
        };
      });

      // If no changes, don't make the API call
      if (!newReleaseInfo || newReleaseInfo.length === 0) {
        toast.info("No changes to submit");
        setLoading(false);
        setResetLoading(false);
        return;
      }

      // Merge with existing data, only updating changed items
      const existingReleaseInfo = movieDetails?.released_information || [];
      const updatedReleaseInfo = [...existingReleaseInfo];

      newReleaseInfo.forEach((newItem: any) => {
        const index = updatedReleaseInfo.findIndex(
          (item: any) => item.name === newItem.name
        );
        if (index !== -1) {
          // Only update the release_date field, preserve all other fields
          updatedReleaseInfo[index] = {
            ...(updatedReleaseInfo[index] as any),
            release_date: newItem.release_date,
          };
        } else {
          updatedReleaseInfo.push(newItem);
        }
      });

      const requestData = {
        movie_id: movie_id.toString(),
        released_information: updatedReleaseInfo,
      };

      const res = await fetch(`/api/movie/${movie_id}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (res.status === 200) {
        router.refresh();
        setStoredData([]);
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Bad Request");
      }
    } catch (error: any) {
      console.error("Bad Request", error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderDateFields = (
    date: any,
    type: "month" | "day" | "year",
    uniqueId: string
  ) => {
    const [year = "-", month = "-", day = "-"] = date?.split("-") || [
      "-",
      "-",
      "-",
      "-",
    ];
    const monthName = getMonthNameFromNumber(month);
    const items = {
      month: releaseDateByMonth,
      day: releaseDateByDay,
      year: releaseDateByYear,
    }[type];
    const customWidth =
      type === "month"
        ? "float-left w-[41.66667%] relative"
        : "float-left w-[25%] relative";
    const selectedValue = selectedValues[`${type}_${uniqueId}`];

    // Assign placeholder and value with default "-" if they are empty
    const placeholder =
      selectedValue ||
      {
        month: monthName || "-",
        day: day || "-",
        year: year || "-",
      }[type];
    const value =
      selectedValue ||
      {
        month: monthName || "-",
        day: day || "-",
        year: year || "-",
      }[type];

    return (
      <div className={`${customWidth} ml-3 w-full`}>
        {openDropdown === `${type}_${uniqueId}` &&
          renderDropdown(
            items,
            selectedValue,
            type,
            uniqueId,
            {
              month: monthName || "-",
              day: day || "-",
              year: year || "-",
            }[type]
          )}
        <input
          type="text"
          readOnly
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onClick={() => handleDropdownToggle(type, uniqueId)}
          className={`w-full text-xs md:text-sm text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer ${
            selectedValue
              ? "border-cyan-400"
              : "border-[#dcdfe6] dark:border-[#3a3b3c]"
          }`}
        />
        <IoIosArrowDown className={`absolute right-2 top-3.5`} />
      </div>
    );
  };

  // Add this function to check if there are any changes
  const hasChanges = () => {
    return Object.keys(selectedValues).length > 0;
  };
  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Release Information
      </h1>
      <div className="-mx-3">
        {combinedData?.map((item: TVShow, idx: number) => {
          return (
            <div key={idx} className="text-left mb-4">
              <div className="float-left w-full lg:w-[75%] relative px-3">
                <label
                  htmlFor="release_date"
                  className="inline-block mb-3 ml-3"
                >
                  Release Date
                </label>
                <div className="-px-3 flex flex-col lg:flex-row gap-2">
                  {["month", "day", "year"].map((type, date_index) => (
                    <span key={date_index} className="w-full flex-1">
                      {renderDateFields(
                        item?.release_date,
                        type as "month" | "day" | "year",
                        `release_${idx}`
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center w-full">
        <button
          name="Submit"
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-3 mt-5 ${
            hasChanges() && !loading
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] cursor-not-allowed"
          }`}
          disabled={!hasChanges() || loading}
        >
          {loading ? <Loader2 className="h-6 w-4 animate-spin" /> : "Submit"}
        </button>
        <button
          type="button"
          className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-4 mt-5 ${
            hasChanges() && !resetLoading
              ? "cursor-pointer"
              : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
          }`}
          onClick={handleReset}
          disabled={!hasChanges() || resetLoading}
        >
          {resetLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="mr-1">
              <FaRegTrashAlt />
            </span>
          )}
          Reset
        </button>
      </div>
    </form>
  );
};

export default ReleaseInfo;
