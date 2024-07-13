"use client";

import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { Controller, useForm } from "react-hook-form";
import { AddSeason, Drama, ITmdbDrama } from "@/helper/type";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditModal {
  item?: ITmdbDrama;
  idx: number;
  setOpen: (open: boolean) => void;
  open: boolean;
  setStoredData: (data: AddSeason[]) => void;
  storedData: AddSeason[];
  season: any;
}

const AddSeasonModal: React.FC<EditModal> = ({
  item,
  idx,
  setOpen,
  open,
  storedData,
  setStoredData,
  season,
}) => {
  const [epStart, setEpStart] = useState<number>(1);
  const [epEnd, setEpEnd] = useState<number>(1);
  const [isEpStart, setIsEpStart] = useState<boolean>(false);
  const [isEpEnd, setIsEpEnd] = useState<boolean>(false);
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
    setEpStart((prevCounter) => prevCounter + 1);
    setIsEpStart(true);
  };
  const handleEpStartDecrement = () => {
    if (epStart > 1) {
      setEpStart((prevCounter) => prevCounter - 1);
      setIsEpStart(true);
    }
  };
  const handleEpEndIncrement = () => {
    setEpEnd((prevCounter) => prevCounter + 1);
    setIsEpEnd(true);
  };

  const handleEpEndDecrement = () => {
    if (epEnd > 1) {
      setEpEnd((prevCounter) => prevCounter - 1);
      setIsEpEnd(true);
    }
  };

  useEffect(() => {
    if (storedData && storedData[idx]) {
      const data = storedData[idx];
      setValue("released_information.name", data?.name as string);
      setValue("released_information.title", data?.title as string);
      setValue("released_information.episode_start", data?.episode_start);
      setValue("released_information.episode_end", data?.episode_end);
      setValue("released_information.air_date", data?.air_date as string);
      reset(data as unknown as Drama);
    }
  }, [idx, open, reset, storedData, setValue]);

  const addingItem = async (data: TCreateDetails) => {
    try {
      const newItem = {
        title: data?.released_information?.title,
        name: item?.name,
        episode_start: epStart,
        episode_end: item?.number_of_episodes || epEnd,
        air_date: data?.released_information?.air_date,
        all_episode: season?.episodes,
      };
      const updatedItems = [...storedData]; // Copy existing items
      updatedItems[idx] = newItem;
      setStoredData(updatedItems);
      setOpen(false);
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    }
  };
  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen bg-black bg-opacity-10">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-[550px] transform rounded-lg bg-white text-left  transition-all my-2">
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
                <form action="">
                  <div className="mb-5">
                    <label
                      htmlFor="service"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
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
                          className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-text"
                          placeholder="e.g. Season 1 or 2024"
                        />
                        <small className="text-muted-foreground opacity-80">
                          The name can be either year or the season number.
                        </small>
                      </div>
                      {/* {errors.services?.service && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errors.services?.service.message}
                        </p>
                      )} */}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="episode_start"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <b>
                        <span className="text-red-500 pr-1">*</span>Episode
                        Start
                      </b>
                    </label>
                    <div className="relative ml-[150px]">
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
                          value={epStart}
                          onChange={(e) => setEpStart(Number(e.target.value))}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className={`block bg-[#3a3b3c] border-b-2 border-b-[#46494a] border-l-2 border-l-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                              epStart === item?.number_of_episodes &&
                              "cursor-not-allowed"
                            }`}
                            onClick={handleEpStartIncrement}
                            disabled={epStart === item?.number_of_episodes}
                          >
                            <IoMdArrowDropup className="" />
                          </button>
                          <button
                            type="button"
                            className="block bg-[#3a3b3c] border-l-2 border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
                            onClick={handleEpStartDecrement}
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
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
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
                          className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] rounded-md outline-none py-2 px-4"
                          value={
                            isEpEnd ? epEnd : item?.number_of_episodes || 0
                          }
                          onChange={(e) => setEpEnd(Number(e.target.value))}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className={`block bg-[#3a3b3c] border-b-2 border-b-[#46494a] border-l-2 border-l-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                              epEnd === item?.number_of_episodes &&
                              "cursor-not-allowed"
                            }`}
                            onClick={handleEpEndIncrement}
                            disabled={epEnd === item?.number_of_episodes}
                          >
                            <IoMdArrowDropup className="" />
                          </button>
                          <button
                            type="button"
                            className="block bg-[#3a3b3c] border-l-2 border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
                            onClick={handleEpEndDecrement}
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
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
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
                                  // Format the date as YYYY-MM-DD before calling field.onChange()
                                  const formattedDate =
                                    date instanceof Date
                                      ? date.toISOString().split("T")[0]
                                      : "";
                                  field.onChange(formattedDate);
                                }}
                                selected={field.value as any}
                                className="w-full bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-end justify-end">
                <button
                  className="bg-[#409eff] text-sm text-white border-2 border-[#409eff] rounded-sm px-5 py-3"
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
