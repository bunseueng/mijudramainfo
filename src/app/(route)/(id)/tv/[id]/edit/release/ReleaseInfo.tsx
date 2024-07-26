"use client";

import { fetchSeasonEpisode, fetchTv } from "@/app/actions/fetchMovieApi";
import {
  episodePerDay,
  releaseDateByDay,
  releaseDateByMonth,
  releaseDateByYear,
  weeklyCheckbox,
} from "@/helper/item-list";
import { AddSeason, Drama, ITmdbDrama, tvId } from "@/helper/type";
import { JsonValue } from "@prisma/client/runtime/library";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import AddSeasonModal from "@/app/component/ui/Modal/AddSeasonModal";
import ClipLoader from "react-spinners/ClipLoader";
import EditSeasonModal from "@/app/component/ui/Modal/EditSeasonModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { TimePicker as AntdTimePicker } from "antd";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { GrPowerReset } from "react-icons/gr";

const ReleaseInfo: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv = [] } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: season } = useQuery({
    queryKey: ["season"],
    queryFn: () => fetchSeasonEpisode(tv_id, tv?.number_of_seasons),
  });
  const [tvDatabase, setTvDatabase] = useState<JsonValue[] | any>(
    tvDetails?.released_information
  );
  const [storedData, setStoredData] = useState<AddSeason[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [seasonLoading, setSeasonLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [drama, setDrama] = useState<any>([]);
  const [broadcast, setBroadcast] = useState<string[]>([]);
  const [timeValue, setTimeValue] = useState([]);
  const [currentBtn, setCurrentBtn] = useState<{
    index: number;
    title: string | undefined;
  }>({ index: -1, title: tvDatabase?.[0]?.season?.[0]?.title });

  const [defaultValues, setDefaultValues] = useState<AddSeason>();
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(tvDetails?.released_information?.length || 0).fill(false)
  );
  const router = useRouter();
  const mergeAndRemoveDuplicates = (
    array1: ITmdbDrama[],
    array2: ITmdbDrama[]
  ): ITmdbDrama[] => {
    const map = new Map<string, ITmdbDrama>();

    array1?.forEach((item: any) => map.set(item?.id, item));
    array2?.forEach((item: any) => map.set(item?.id, item));

    return Array.from(map.values());
  };
  const combinedData = mergeAndRemoveDuplicates([tv], tvDatabase as any[]);
  const combinedStoredData = mergeAndRemoveDuplicates(
    [tv],
    storedData as any[]
  );

  const [markedForDeletionDrama, setMarkedForDeletionDrama] = useState<
    boolean[]
  >(Array(combinedStoredData?.length || 0).fill(false));

  const [markedForDeletionBroadcast, setMarkedForDeletionBroadcast] = useState<
    boolean[]
  >(Array(tvDetails?.released_information?.length || 0).fill(false));

  useEffect(() => {
    if (tvDatabase && tvDatabase.length > 0) {
      setDrama([...tvDatabase, ...(storedData || [])]);
    } else {
      setDrama([tv, ...(storedData || [])]);
    }
  }, [tv, tvDatabase, storedData]);

  const handleDropdownToggle = (dropdown: string, uniqueId: string) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}_${uniqueId}` ? null : `${dropdown}_${uniqueId}`
    );
  };

  const handleTimeChange = (index: number, newValue: any) => {
    // Update state only if the value actually changes
    if (newValue !== timeValue[index]) {
      const newTimeValues = [...timeValue] as any;
      newTimeValues[index] = newValue;
      setTimeValue(newTimeValues);
    }
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

  const markForDeletionBroadcast = (
    idx: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const newMarkedForDeletion = [...markedForDeletionBroadcast];
    newMarkedForDeletion[idx] = !newMarkedForDeletion[idx]; // Toggle the deletion status
    setMarkedForDeletionBroadcast(newMarkedForDeletion);
  };

  const handleTitleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    title: string | undefined
  ) => {
    e.preventDefault();
    setSeasonLoading(true);
    setTimeout(() => setSeasonLoading(false), 200);
    setCurrentBtn({ index, title });
  };

  const handleReset = (index: number) => {
    setMarkedForDeletionBroadcast((prev) =>
      prev.map((marked, idx) => (idx === index ? false : marked))
    );
    setMarkedForDeletionDrama((prev) =>
      prev.map((marked, idx) => (idx === index ? false : marked))
    );
    setIsItemDataChanged((prev) =>
      prev.map((changed, idx) => (idx === index ? false : changed))
    );
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
        className="w-full absolute text-black dark:text-white bg-white dark:bg-[#242424] border-2 border-[#f3f3f3] dark:border-[#242424]  py-1 mt-14 rounded-md z-10 custom-scroll overflow-auto shadow-md"
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

  const handleCheckboxChange = (value: string) => {
    setBroadcast((prevCheckedDays) =>
      prevCheckedDays.includes(value)
        ? prevCheckedDays.filter((d) => d !== value)
        : [...prevCheckedDays, value]
    );
  };

  const handleDropdownSelect = (
    type: string,
    uniqueId: string,
    value: string
  ) => {
    const key = `${type}_${uniqueId}`;
    setSelectedValues((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleOpenModal = (idx: number) => {
    setDeleteIndex(idx);
    setOpenEditModal(true);
    setOpen(false);
    setDefaultValues({
      name: drama[idx]?.name,
      title: drama[idx]?.title,
      episode_start: drama[idx]?.episode_start,
      episode_end: drama[idx]?.episode_end,
      air_date: drama[idx]?.air_date,
    });
  };

  const handleAddNewSeason = () => {
    setOpen(true);
    setOpenEditModal(false); // Ensure only one modal is open
    setDeleteIndex(null);
  };

  const formatDateForSubmission = (date: Date) => {
    if (date) {
      return dayjs(date).format("ddd MMM D YYYY hh:mm:ss A");
    } else {
      return ""; // Handle case where date is null
    }
  };

  const extractMonthNumber = (month: string) => {
    return month?.split(" - ")[0];
  };

  // Function to combine month, day, and year
  const combineDate = (month: string, day: string, year: string) => {
    const formattedMonth = extractMonthNumber(month)?.padStart(2, "0");
    const formattedDay = day?.padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const releaseDate = {
        year: selectedValues?.year_release_0,
        day: selectedValues?.day_release_0,
        month: selectedValues?.month_release_0,
      };
      const endDate = {
        year: selectedValues?.year_end_0,
        day: selectedValues?.day_end_0,
        month: selectedValues?.month_end_0,
      };

      const newReleaseInfo =
        drama?.map((item: any, idx: number) => {
          const existingBroadcast = item.broadcast || [];
          const firstAirDateParts = item.first_air_date
            ? item.first_air_date.split("-")
            : ["-", "-", "-"];
          const [firstAirYear, firstAirMonth, firstAirDay] = firstAirDateParts;
          const lastAirDateParts = item.last_air_date
            ? item.last_air_date.split("-")
            : ["-", "-", "-"];
          const [lastAirYear, lastAirMonth, lastAirDay] = lastAirDateParts;

          const selectedDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ]; // Add all possible days
          const newBroadcast = selectedDays
            .map((day, idx) => {
              const time = timeValue?.[idx];
              const episode = selectedValues?.[`episode_ep${idx}`];
              if (time && episode) {
                return {
                  day,
                  time: formatDateForSubmission(new Date(time)),
                  episode,
                };
              } else if (time) {
                return {
                  day,
                  time: formatDateForSubmission(new Date(time)),
                  episode: episode ? item?.episode : "1 episode per day",
                };
              } else if (episode) {
                return {
                  day,
                  episode,
                };
              }
              return null;
            })
            .filter((entry) => entry !== null);

          // Filter out items in drama marked for deletion
          const filteredBroadcast = item?.broadcast?.filter(
            (_item: any, idx: number) => !markedForDeletionBroadcast[idx]
          );

          let updatedBroadcast = existingBroadcast.map((existingItem: any) => {
            const newItem = newBroadcast.find(
              (newItem: any) => newItem?.day === existingItem.day
            );
            return newItem
              ? { ...existingItem, ...newItem, ...filteredBroadcast }
              : existingItem;
          });

          newBroadcast.forEach((newItem: any) => {
            if (
              !updatedBroadcast.find(
                (existingItem: any) => existingItem.day === newItem.day
              )
            ) {
              updatedBroadcast.push(newItem);
            }
          });

          // Filter out seasons marked for deletion
          const filteredSeasons = (item.season || []).filter(
            (_season: any, seasonIdx: number) =>
              !markedForDeletionDrama[seasonIdx]
          );

          // Append new seasons to existing seasons, avoiding duplicates
          const newSeasons = storedData?.length > 0 ? storedData : [];
          const combinedSeasons = [
            ...filteredSeasons,
            ...newSeasons.filter(
              (newSeason) =>
                !filteredSeasons.some(
                  (existingSeason: any) =>
                    existingSeason.title === newSeason.title &&
                    existingSeason.name === newSeason.name
                )
            ),
          ];

          return {
            ...item,
            release_date:
              !releaseDate.month && !releaseDate.day && !releaseDate.year
                ? item?.release_date
                : combineDate(
                    releaseDate.month?.length > 0
                      ? releaseDate?.month
                      : firstAirMonth,
                    releaseDate.day?.length > 0
                      ? releaseDate?.day
                      : firstAirDay,
                    releaseDate.year?.length > 0
                      ? releaseDate?.year
                      : firstAirYear
                  ),
            end_date:
              !endDate.month && !endDate.day && !endDate.year
                ? item?.end_date
                : combineDate(
                    endDate.month?.length > 0 ? endDate?.month : lastAirMonth,
                    endDate.day?.length > 0 ? endDate?.day : lastAirDay,
                    endDate.year?.length > 0 ? endDate?.year : lastAirYear
                  ),
            season: combinedSeasons,
            broadcast:
              updatedBroadcast?.length > 0
                ? updatedBroadcast
                : tvDatabase?.[0]?.broadcast || [],
          };
        }) || [];

      const existingReleaseInfo =
        tvDetails?.released_information || ([] as any);

      // Update existing entries or add new entries, filtering out deleted seasons
      newReleaseInfo.forEach((newItem: any) => {
        const index = existingReleaseInfo.findIndex(
          (item: any) => item.name === newItem.name
        );
        if (index !== -1) {
          // Update existing entry
          existingReleaseInfo[index] = {
            ...(existingReleaseInfo[index] as number[]),
            ...newItem,
            broadcast: [
              ...existingReleaseInfo[index]?.broadcast?.filter(
                (_entry: any, id: number) => !markedForDeletionBroadcast[id]
              ),
              ...newItem.broadcast.filter(
                (newDay: any) =>
                  !existingReleaseInfo[index]?.broadcast?.some(
                    (existingDay: any) => existingDay.day === newDay.day
                  )
              ),
            ],
            season: [
              ...existingReleaseInfo[index]?.season.filter(
                (_entry: any, seasonIdx: number) =>
                  !markedForDeletionDrama[seasonIdx]
              ),
              ...newItem.season.filter(
                (newSeason: any) =>
                  !existingReleaseInfo[index]?.season?.some(
                    (existingSeason: any) =>
                      existingSeason.title === newSeason.title &&
                      existingSeason.name === newSeason.name
                  )
              ),
            ],
          };
        } else {
          // Add new entry
          existingReleaseInfo.push(newItem);
        }
      });

      const requestData = {
        tv_id: tv_id.toString(),
        released_information: existingReleaseInfo,
      };

      const res = await fetch(`/api/tv/${tv_id}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (res.status === 200) {
        router.refresh();
        setStoredData([]);
        setMarkedForDeletionDrama(Array(drama?.length || 0).fill(false));
        setMarkedForDeletionBroadcast(Array(drama?.length || 0).fill(false));
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
    type: "month" | "day" | "year" | "episode",
    uniqueId: string
  ) => {
    const [year = "-", month = "-", day = "-", episode = "-"] = date?.split(
      "-"
    ) || ["-", "-", "-", "-"];
    const monthName = getMonthNameFromNumber(month);
    const items = {
      month: releaseDateByMonth,
      day: releaseDateByDay,
      year: releaseDateByYear,
      episode: episodePerDay,
    }[type];
    const dropdownClass =
      type === "episode"
        ? "relative mx-1 w-full lg:py-0"
        : "relative mx-1 py-1 lg:py-0";
    const customWidth =
      type === "month" ? "float-left w-[41.66667%]" : "float-left w-[25%]";
    const inputClass =
      type === "episode"
        ? "w-full bg-white dark:bg-[#3a3b3c] placeholder:text-xs border-2 border-[#f3f3f3] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 pt-1 pb-[2px] px-3 cursor-pointer"
        : "w-full bg-white dark:bg-[#3a3b3c] placeholder:text-sm border-2 border-[#f3f3f3] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer";
    const selectedValue = selectedValues[`${type}_${uniqueId}`];

    // Assign placeholder and value with default "-" if they are empty
    const placeholder =
      selectedValue ||
      (type === "episode"
        ? date
        : {
            month: monthName || "-",
            day: day || "-",
            year: year || "-",
            episode,
          }[type]);
    const value =
      selectedValue ||
      (type === "episode"
        ? date
        : {
            month: monthName || "-",
            day: day || "-",
            year: year || "-",
            episode,
          }[type]);

    return (
      <div className={`${dropdownClass} ${customWidth}`}>
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
              episode,
            }[type]
          )}
        <input
          type="text"
          readOnly
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onClick={() => handleDropdownToggle(type, uniqueId)}
          className={`${inputClass}`}
        />
        <IoIosArrowDown
          className={`absolute right-2 ${
            type === "episode" ? "bottom-2" : "bottom-3"
          }`}
        />
      </div>
    );
  };

  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Release Information
      </h1>
      <div className="-mx-3">
        {combinedData?.map((item: ITmdbDrama, idx: number) => {
          const hasBroadcasts = tvDatabase?.some(
            (tv: any) => tv?.broadcast && tv.broadcast.length > 0
          );

          const dayFromDB = item?.broadcast?.flatMap((time) => time?.day);
          const timestampStr = item?.broadcast?.map((time) => time?.time);
          const datetimeObj = moment(
            timestampStr,
            "ddd MMM DD YYYY hh:mm:ss A"
          );
          // Check if the date is valid
          if (datetimeObj.isValid()) {
            const timeStr = datetimeObj.format("hh:mm A");
          } else {
          }
          return (
            <div key={idx} className="text-left mb-4">
              <div className="float-left w-full lg:w-[50%] relative px-3">
                <label
                  htmlFor="release_date"
                  className="inline-block mb-3 ml-3"
                >
                  Release Date
                </label>
                <div className="-px-3 flex flex-col lg:flex-row">
                  {["month", "day", "year"].map((type) => {
                    return renderDateFields(
                      item?.release_date
                        ? item?.release_date
                        : item?.first_air_date,
                      type as "month" | "day" | "year",
                      `release_${idx}`
                    );
                  })}
                </div>
              </div>
              <div className="float-left w-full lg:w-[50%] relative px-3">
                <label
                  htmlFor=""
                  className="inline-block mb-3 ml-3 mt-3 lg:mt-0"
                >
                  End Date
                </label>
                <div className="-px-3 flex flex-col lg:flex-row">
                  {["month", "day", "year"].map((type) =>
                    renderDateFields(
                      item?.end_date ? item?.end_date : item?.last_air_date,
                      type as "month" | "day" | "year",
                      `end_${idx}`
                    )
                  )}
                </div>
              </div>
              <div className="w-full float-left text-left mt-4  px-3">
                <label htmlFor="season" className="inline-block my-2 ml-3">
                  Seasons
                </label>
                <div className="w-full">
                  <button
                    className="inline-flex items-center text-sm font-semibold whitespace-nowrap text-center text-black dark:text-white leading-[1px] bg-[#fff] border-2 border-[#dcdfe6] dark:bg-[#3a3b3c] dark:border-[#3e4042] py-2 px-5 rounded-md ml-3"
                    onClick={(e) => {
                      e.preventDefault(), handleAddNewSeason();
                    }}
                  >
                    <IoMdAdd />
                    <span>Add New Season</span>
                  </button>
                  {open && (
                    <AddSeasonModal
                      item={item}
                      idx={idx}
                      open={open}
                      setOpen={setOpen}
                      storedData={storedData}
                      setStoredData={setStoredData}
                      season={season}
                    />
                  )}

                  <table className="w-full max-w-[100%] my-4 ml-3 overflow-hidden">
                    <thead>
                      <tr>
                        <th className="border-y-2 border-y-[#eceeef] dark:border-y-[#3e4042] align-bottom py-2 px-4">
                          Name
                        </th>
                        <th className="border-y-2 border-y-[#eceeef] dark:border-y-[#3e4042] align-bottom py-2 px-4">
                          Episodes
                        </th>
                        <th
                          className="border-y-2 border-y-[eceeef1] dark:border-y-[#3e4042] align-bottom py-2 px-4"
                          colSpan={2}
                        >
                          Air Date
                        </th>
                      </tr>
                    </thead>
                    {[...(tvDatabase?.[0]?.season || []), ...storedData]
                      ?.length > 0 ? (
                      <>
                        {[
                          ...(tvDatabase?.[0]?.season || []),
                          ...storedData,
                        ]?.map((data: AddSeason, index: number) => {
                          return (
                            <tbody key={index}>
                              <tr>
                                <td
                                  className={`border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] px-4 py-3 ${
                                    storedData.some((item) => item === data)
                                      ? "text-[#0275d8]"
                                      : ""
                                  } ${
                                    isItemDataChanged[index]
                                      ? "text-[#2196f3]"
                                      : ""
                                  } ${
                                    markedForDeletionDrama[index]
                                      ? "text-red-500 line-through"
                                      : ""
                                  }`}
                                >
                                  {data?.title || data?.name}
                                </td>
                                <td
                                  className={`border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] px-4 py-3 ${
                                    storedData.some((item) => item === data)
                                      ? "text-[#0275d8]"
                                      : ""
                                  } ${
                                    isItemDataChanged[index]
                                      ? "text-[#2196f3]"
                                      : ""
                                  } ${
                                    markedForDeletionDrama[index]
                                      ? "text-red-500 line-through"
                                      : ""
                                  }`}
                                >{`1 - ${
                                  data?.number_of_episodes || data?.episode_end
                                }`}</td>
                                <td
                                  className={`border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] px-4 py-3 ${
                                    storedData.some((item) => item === data)
                                      ? "text-[#0275d8]"
                                      : ""
                                  } ${
                                    isItemDataChanged[index]
                                      ? "text-[#2196f3]"
                                      : ""
                                  } ${
                                    markedForDeletionDrama[index]
                                      ? "text-red-500 line-through"
                                      : ""
                                  }`}
                                >
                                  {data?.first_air_date || data?.air_date}
                                </td>
                                <td className="w-[114px] px-4 py-3">
                                  <div>
                                    {(markedForDeletionDrama[index] ||
                                      markedForDeletionBroadcast[index] ||
                                      isItemDataChanged[index]) && (
                                      <button
                                        type="button"
                                        className="min-w-5 text-black dark:text-white bg-white dark:bg-[#3a3b3c] text-[#ffffffde] border-2 border-[#f3f3f3f3] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-2 mr-2"
                                        onClick={() => handleReset(index)}
                                      >
                                        <GrPowerReset />
                                      </button>
                                    )}
                                    <button
                                      className="min-w-5 text-black dark:text-white bg-white dark:bg-[#3a3b3c] text-[#ffffffde] border-2 border-[#f3f3f3f3] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOpenModal(index);
                                      }}
                                    >
                                      <CiEdit />
                                    </button>
                                    {openEditModal && deleteIndex === index && (
                                      <EditSeasonModal
                                        setOpenEditModal={setOpenEditModal}
                                        openEditModal={openEditModal}
                                        item={[drama[deleteIndex]]}
                                        idx={deleteIndex}
                                        setStoredData={setStoredData}
                                        storedData={storedData}
                                        setIsItemDataChanged={
                                          setIsItemDataChanged
                                        }
                                        isItemDataChanged={isItemDataChanged}
                                        markedForDeletion={
                                          markedForDeletionDrama
                                        }
                                        setMarkedForDeletion={
                                          setMarkedForDeletionDrama
                                        }
                                        defaultValue={defaultValues}
                                        setTvDatabase={setTvDatabase}
                                        tvDatabase={tvDatabase}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </>
                    ) : (
                      <div className="align-top py-3 px-4">
                        No data available.
                      </div>
                    )}
                  </table>
                </div>

                <label htmlFor="broadcast_times" className="ml-3">
                  Broadcast Times (UTC +8:00)
                </label>
                <div>
                  <div className="ml-3 mt-2">
                    <div className="border-2 border-white p-3">
                      <ul className="flex items-center text-sm text-[#2196f3] dark:text-gray-200">
                        {weeklyCheckbox?.map((check: any, weekIdx: number) => {
                          return (
                            <li key={weekIdx} className="pt-1 mt-0 mr-5">
                              <label className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300 flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={check.value}
                                  checked={
                                    broadcast?.includes(check.value)
                                      ? broadcast?.includes(check.value)
                                      : dayFromDB?.includes(check.value)
                                  }
                                  className="relative peer w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded dark:checked:text-[#2196f3] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-[#2196f3] dark:focus:ring-offset-[#2196f3] focus:ring-2 dark:bg-[#242424] dark:border-[#2196f3] appearance-none"
                                  onClick={(e: any) => {
                                    if (dayFromDB?.includes(check?.value)) {
                                      markForDeletionBroadcast(weekIdx, e);
                                    } else {
                                      handleCheckboxChange(check.value);
                                    }
                                  }}
                                />
                                <span className="ms-2 text-xs lg:text-[15px] font-medium text-gray-900 dark:text-gray-300">
                                  {check.value}
                                </span>
                                <FaCheck className="absolute w-4 h-4 hidden peer-checked:block pointer-events-none" />
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <hr className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] my-4 ml-3" />
                    {hasBroadcasts ||
                      (!hasBroadcasts && (
                        <div className="flex flex-col ml-2">
                          {broadcast
                            ?.sort((a: any, b: any) => {
                              // Custom sorting logic based on day order (Monday to Sunday)
                              const daysOfWeek = weeklyCheckbox?.map(
                                (week: any) => week?.value
                              );
                              return (
                                daysOfWeek.indexOf(a?.day || a) -
                                daysOfWeek.indexOf(b?.day || b)
                              );
                            })
                            ?.map((time, broadcastId) => {
                              return (
                                <div
                                  key={broadcastId}
                                  className={`mt-4 p-1 -mx-3`}
                                >
                                  <div className={`flex my-3`}>
                                    <div
                                      className={`float-left w-[16.66667%] relative px-4 py-3 ${
                                        broadcast ? "text-[#6cc788]" : ""
                                      }`}
                                    >
                                      {time}
                                    </div>
                                    <div className="float-left w-[25%] relative px-4 py-3">
                                      <AntdTimePicker
                                        use12Hours
                                        value={timeValue[broadcastId]}
                                        placeholder={timeValue[broadcastId]}
                                        format="h:mm A"
                                        onChange={(newValue) =>
                                          handleTimeChange(
                                            broadcastId,
                                            newValue
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="float-left w-[25%] relative pl-4 py-3">
                                      <div className="w-full -px-3 flex flex-col lg:flex-row">
                                        {renderDateFields(
                                          "1 episode per day",
                                          "episode",
                                          `ep${broadcastId}`
                                        )}
                                      </div>
                                    </div>
                                    <div className="float-left w-[25%] relative px-4 py-3"></div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))}
                    {hasBroadcasts && (
                      <div className="flex flex-col ml-2">
                        {[...(tvDatabase as JsonValue | any), ...broadcast]
                          ?.sort((a: any, b: any) => {
                            // Custom sorting logic based on day order (Monday to Sunday)
                            const daysOfWeek = weeklyCheckbox?.map(
                              (week: any) => week?.value
                            );
                            return (
                              daysOfWeek.indexOf(a?.day || a) -
                              daysOfWeek.indexOf(b?.day || b)
                            );
                          })
                          ?.filter((bTime: any) => {
                            return bTime?.broadcast?.some(
                              (item: any) => item?.day !== dayFromDB
                            );
                          })
                          ?.map((time: any, castIdx: number) => {
                            return (
                              <div key={castIdx} className={`mt-4 p-1 -mx-3`}>
                                {[...broadcast, ...time?.broadcast]
                                  ?.sort((a: any, b: any) => {
                                    // Custom sorting logic based on day order (Monday to Sunday)
                                    const daysOfWeek = weeklyCheckbox?.map(
                                      (week: any) => week?.value
                                    );
                                    return (
                                      daysOfWeek.indexOf(a?.day || a) -
                                      daysOfWeek.indexOf(b?.day || b)
                                    );
                                  })
                                  ?.filter((bTime: any) => {
                                    return !dayFromDB?.some((day: any) =>
                                      day?.includes(bTime)
                                    );
                                  })
                                  .map((timeDay: any, bId: number) => {
                                    return (
                                      <div
                                        key={bId}
                                        className={`flex my-3 ${
                                          markedForDeletionBroadcast[bId]
                                            ? "bg-red-400"
                                            : ""
                                        }`}
                                      >
                                        <div
                                          className={`float-left w-[16.66667%] relative px-4 py-3 ${
                                            !timeDay?.day
                                              ? "text-[#6cc788]"
                                              : ""
                                          }`}
                                        >
                                          {timeDay?.day || timeDay}
                                        </div>
                                        <div className="float-left w-[25%] relative px-4 py-3">
                                          <AntdTimePicker
                                            use12Hours
                                            value={timeValue[bId]}
                                            placeholder={
                                              datetimeObj.isValid()
                                                ? moment(
                                                    timeDay?.time,
                                                    "ddd MMM DD YYYY hh:mm:ss A"
                                                  ).format("h:mm A")
                                                : timeValue[bId]
                                            }
                                            format="h:mm A"
                                            onChange={(newValue) =>
                                              handleTimeChange(bId, newValue)
                                            }
                                          />
                                        </div>
                                        <div className="float-left w-[25%] relative pl-4 py-2 md:py-3">
                                          <div className="w-full -px-3 flex flex-col lg:flex-row">
                                            {renderDateFields(
                                              timeDay?.episode,
                                              "episode",
                                              `ep${bId}`
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-12 ml-3">
                  <label htmlFor="broadcast_times">
                    Broadcast Times (UTC +8:00)
                  </label>
                  <hr className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] my-4" />
                  {!markedForDeletionDrama[idx] && (
                    <>
                      {[...(tvDatabase?.[0]?.season || []), ...storedData]
                        ?.length > 0 && (
                        <>
                          <div className="mt-4">
                            {[
                              ...(tvDatabase?.[0]?.season || []),
                              ...storedData,
                            ]?.map((data: AddSeason, indx: number) => (
                              <button
                                className={`text-sm border-2 py-2 px-5 rounded-md ml-3 ${
                                  currentBtn.index === indx &&
                                  currentBtn.title === data?.title
                                    ? "text-white bg-[#2b9effcc] border-[#b3d8ff33]"
                                    : "text-black dark:text-white bg-[#fff] dark:bg-[#3a3b3c] border-[#dcdfe6] dark:border-[#3e4042]"
                                }`}
                                key={indx}
                                onClick={(e) => {
                                  setSeasonLoading(true);
                                  setTimeout(
                                    () => setSeasonLoading(false),
                                    200
                                  );
                                  e.preventDefault();
                                  handleTitleClick(e, indx, data?.title);
                                  setCurrentBtn({
                                    index: indx,
                                    title: data?.title,
                                  });
                                }}
                              >
                                {data?.title || data?.name}
                              </button>
                            ))}
                          </div>

                          {seasonLoading ? (
                            <div className="text-center text-[#ffffffde] bg-white dark:bg-[#242526] border-2 border-white dark:border-[#3e4042] overflow-hidden transform transition-transform rounded-md mt-4 p-4">
                              <ClipLoader
                                loading={seasonLoading}
                                color="#409effcc"
                              />
                            </div>
                          ) : (
                            <div className="text-[#ffffffde] bg-white dark:bg-[#242526] border-2 border-[#06090c21] dark:border-[#3e4042] shadow-sm overflow-hidden transform transition-transform rounded-md mt-4">
                              <div className="p-5">
                                {season?.episodes?.map(
                                  (ep: any, id: number) => (
                                    <div
                                      className={`float-left w-full p-4 ${
                                        id > 0 &&
                                        "border-t-2 border-t-[#78828c21]"
                                      }`}
                                      key={id}
                                    >
                                      <div>
                                        <div className="m-0">
                                          <div className="text-black dark:text-white float-left w-[66.66667%] relative">
                                            <h6>{ep?.name}</h6>
                                            <div>Air Date: {ep?.air_date}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="float-left w-full">
        {tvDatabase?.[0]?.season.length > 0 ||
          (storedData.length > 0 && (
            <hr className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] my-4 ml-3 " />
          ))}
        <button
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-3 mt-5 ${
            broadcast?.length > 0 ||
            timeValue?.length > 0 ||
            storedData?.length > 0 ||
            Object.keys(selectedValues).length > 0 ||
            markedForDeletionBroadcast?.includes(true) ||
            markedForDeletionDrama?.includes(true)
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            broadcast?.length > 0 ||
            timeValue?.length > 0 ||
            storedData?.length > 0 ||
            Object.keys(selectedValues).length > 0 ||
            markedForDeletionBroadcast?.includes(true) ||
            markedForDeletionDrama?.includes(true)
              ? false
              : true
          }
        >
          <span className="mr-1 pt-1">
            <ClipLoader color="#242526" loading={loading} size={19} />
          </span>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ReleaseInfo;
