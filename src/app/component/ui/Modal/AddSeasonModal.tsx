import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { Controller, useForm } from "react-hook-form";
import { AddSeason, Drama, DramaDetails, TVShow } from "@/helper/type";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditModal {
  item?: TVShow;
  idx: number;
  setOpen: (open: boolean) => void;
  open: boolean;
  setStoredData: (data: AddSeason[]) => void;
  storedData: AddSeason[];
  season: any;
  detail: DramaDetails;
}

const AddSeasonModal: React.FC<EditModal> = ({
  item,
  idx,
  setOpen,
  open,
  storedData,
  setStoredData,
  season,
  detail,
}) => {
  const maxEpisodes = detail?.episode || item?.number_of_episodes || 999;
  const [epStart, setEpStart] = useState<number>(1);
  const [epEnd, setEpEnd] = useState<number>(maxEpisodes > 1 ? 2 : 1);
  const [isEpStart, setIsEpStart] = useState<boolean>(false);
  const [isEpEnd, setIsEpEnd] = useState<boolean>(false);
  console.log(item);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const handleEpStartIncrement = () => {
    if (epStart < epEnd) {
      setEpStart((prevCounter) => prevCounter + 1);
      setIsEpStart(true);
    }
  };

  const handleEpStartDecrement = () => {
    if (epStart > 1) {
      setEpStart((prevCounter) => prevCounter - 1);
      setIsEpStart(true);
    }
  };

  const handleEpEndIncrement = () => {
    if (epEnd < maxEpisodes) {
      setEpEnd((prevEnd) => prevEnd + 1);
      setIsEpEnd(true);
    }
  };

  const handleEpEndDecrement = () => {
    if (epEnd > epStart) {
      setEpEnd((prevEnd) => prevEnd - 1);
      setIsEpEnd(true);
    }
  };

  useEffect(() => {
    if (storedData && storedData[idx]) {
      const data = storedData[idx];
      setValue("released_information.name", data?.name as string);
      setValue("released_information.episode_start", data?.episode_start);
      setValue("released_information.episode_end", data?.episode_end);
      setValue("released_information.air_date", data?.air_date as string);
      reset(data as unknown as Drama);
    }
  }, [idx, open, reset, storedData, setValue]);

  const addingItem = async (data: TCreateDetails) => {
    try {
      // Create an array of episodes from 1 to episode_end
      const episodes = Array.from({ length: epEnd }, (_, index) => ({
        date: data?.released_information?.air_date,
        time: "12:00 PM",
        episode_number: index + 1, // Start from 1
      }));

      const newItem = {
        title: data?.released_information?.title,
        name: item?.name,
        episode_start: epStart,
        episode_end: epEnd,
        air_date: data?.released_information?.air_date,
        all_episode: episodes,
      };

      const updatedItems = [...storedData, newItem];
      setStoredData(updatedItems);
      setOpen(false);
    } catch (error: any) {
      throw new Error(error?.message || "Failed to add item");
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen bg-black bg-opacity-10">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-[550px] transform rounded-lg bg-white text-left transition-all my-2">
            <div className="bg-white dark:bg-[#242526] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-md">
              <div className="sm:flex sm:items-center justify-between">
                <div className="flex items-center justify-between">
                  <h1>Add Item</h1>
                </div>
                <button onClick={() => setOpen(false)}>
                  <IoClose />
                </button>
              </div>
              <div className="text-[#ffffff99] text-md break-words px-5 py-7">
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="w-[150px] text-[#00000099] dark:text-white inline-block text-right float-left align-middle leading-[44px] pr-3"
                  >
                    <span className="text-red-500 pr-1">*</span>Name
                  </label>
                  <div className="relative ml-[150px]">
                    <div className="relative">
                      <input
                        {...register("released_information.title")}
                        type="text"
                        name="released_information.title"
                        autoComplete="off"
                        className="w-full text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#c0c4cc] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-text"
                        placeholder="e.g. Season 1 or 2024"
                      />
                      <small className="text-muted-foreground opacity-80">
                        The name can be either year or the season number.
                      </small>
                    </div>
                    {errors.released_information?.title && (
                      <p className="text-xs italic text-red-500">
                        {errors.released_information?.title?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="episode_start"
                    className="w-[150px] text-[#00000099] dark:text-white inline-block text-right float-left align-middle leading-[44px] pr-3"
                  >
                    <b>
                      <span className="text-red-500 pr-1">*</span>Episode Start
                    </b>
                  </label>
                  <div className="relative ml-[150px]">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#c0c4cc] rounded-md outline-none py-2 px-4"
                        value={epStart}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= epEnd) {
                            setEpStart(value);
                            setIsEpStart(true);
                          }
                        }}
                      />
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b-[1px] border-b-[#c0c4cc] dark:border-b-[#46494a] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] border-t-[1px] dark:border-t-0 border-t-[#c0c4cc] dark:border-t-[#46494a] border-r-[1px] dark:border-r-0 border-r-[#c0c4cc] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                            epStart >= epEnd && "cursor-not-allowed"
                          }`}
                          onClick={handleEpStartIncrement}
                          disabled={epStart >= epEnd}
                        >
                          <IoMdArrowDropup className="" />
                        </button>
                        <button
                          type="button"
                          className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group ${
                            epStart <= 1 && "cursor-not-allowed"
                          }`}
                          onClick={handleEpStartDecrement}
                          disabled={epStart <= 1}
                        >
                          <IoMdArrowDropdown />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="episode_end"
                    className="w-[150px] text-[#00000099] dark:text-white inline-block text-right float-left align-middle leading-[44px] pr-3"
                  >
                    <b>
                      <span className="text-red-500 pr-1">*</span>Episode End
                    </b>
                  </label>
                  <div className="relative ml-[150px]">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#c0c4cc] rounded-md outline-none py-2 px-4"
                        value={epEnd}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= epStart && value <= maxEpisodes) {
                            setEpEnd(value);
                            setIsEpEnd(true);
                          }
                        }}
                      />
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b-[1px] border-b-[#c0c4cc] dark:border-b-[#46494a] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] border-t-[1px] dark:border-t-0 border-t-[#c0c4cc] dark:border-t-[#46494a] border-r-[1px] dark:border-r-0 border-r-[#c0c4cc] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                            epEnd >= maxEpisodes && "cursor-not-allowed"
                          }`}
                          onClick={handleEpEndIncrement}
                          disabled={epEnd >= maxEpisodes}
                        >
                          <IoMdArrowDropup className="" />
                        </button>
                        <button
                          type="button"
                          className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group ${
                            epEnd <= epStart && "cursor-not-allowed"
                          }`}
                          onClick={handleEpEndDecrement}
                          disabled={epEnd <= epStart}
                        >
                          <IoMdArrowDropdown />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="air_date"
                    className="w-[150px] text-[#00000099] dark:text-white inline-block text-right float-left align-middle leading-[44px] pr-3"
                  >
                    <b>
                      <span className="text-red-500 pr-1">*</span>Air Date
                    </b>
                  </label>
                  <div className="relative ml-[150px]">
                    <div className="relative">
                      <Controller
                        control={control}
                        name="released_information.air_date"
                        render={({ field }) => {
                          return (
                            <ReactDatePicker
                              placeholderText={"YYYY-MM-DD"}
                              onChange={(date) => {
                                const formattedDate =
                                  date instanceof Date
                                    ? new Date(
                                        Date.UTC(
                                          date.getFullYear(),
                                          date.getMonth(),
                                          date.getDate()
                                        )
                                      )
                                        .toISOString()
                                        .split("T")[0]
                                    : "";
                                field.onChange(formattedDate);
                              }}
                              selected={field.value as any}
                              className="w-full text-black dark:text-white bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
                            />
                          );
                        }}
                      />
                      {errors.released_information?.air_date && (
                        <p className="text-xs italic text-red-500">
                          {errors.released_information?.air_date?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="button"
                  name="Add"
                  aria-label="Add"
                  className="bg-[#409eff] text-sm text-white border-[1px] border-[#409eff] rounded-sm px-5 py-3"
                  onClick={handleSubmit(addingItem)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSeasonModal;
