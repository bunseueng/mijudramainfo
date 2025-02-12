"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { Controller, useForm } from "react-hook-form";
import { AddSeason, Drama, TVShow } from "@/helper/type";
import { JsonValue } from "@prisma/client/runtime/library";
import ReactDatePicker from "react-datepicker";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

interface EditModal {
  idx: number;
  setOpenEditModal: (open: boolean) => void;
  item: TVShow[];
  setStoredData: (data: AddSeason[]) => void;
  storedData: AddSeason[];
  setIsItemDataChanged: (data: boolean[]) => void;
  isItemDataChanged: boolean[]; // Update the type here
  markedForDeletion: boolean[];
  setMarkedForDeletion: (data: boolean[]) => void;
  defaultValue: AddSeason | undefined;
  setTvDatabase: (data: JsonValue[] | undefined) => void;
}

const EditSeasonModal: React.FC<EditModal> = ({
  idx,
  setOpenEditModal,
  item,
  setStoredData,
  storedData,
  setIsItemDataChanged,
  isItemDataChanged,
  markedForDeletion,
  setMarkedForDeletion,
  defaultValue,
  setTvDatabase,
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
    if (item) {
      setValue("released_information.name", defaultValue?.name as string);
      setValue("released_information.title", defaultValue?.title as string);
      setValue(
        "released_information.episode_start",
        defaultValue?.episode_start
      );
      setValue("released_information.episode_end", defaultValue?.episode_end);
      setValue(
        "released_information.air_date",
        defaultValue?.air_date as string
      );
      reset(defaultValue as unknown as Drama);
    }
    if (storedData && storedData[idx]) {
      const data = storedData[idx];
      setValue("released_information.name", data?.name as string);
      setValue("released_information.title", data?.title as string);
      setValue("released_information.episode_start", data?.episode_start);
      setValue("released_information.episode_end", data?.episode_end);
      setValue("released_information.air_date", data?.air_date as string);
      reset(data as unknown as Drama);
    }
  }, [idx, item, reset, storedData, setValue, defaultValue]);

  const updatingItems = async (data: TCreateDetails) => {
    try {
      const updatedData = item?.map((item: any, index: number) => {
        if (item?.service_name === defaultValue?.name) {
          const newData = {
            ...item,
            name: item?.name,
            title: data?.released_information?.title,
            episode_start: epStart,
            episode_end: item?.number_of_episodes || epEnd,
            air_date: data?.released_information?.air_date,
          };
          if (newData) {
            const newState = [...isItemDataChanged];
            newState[index] = true; // Assuming `index` is the index of the item that changed
            setIsItemDataChanged(newState);
          }
          return newData;
        }
        return item;
      });
      setTvDatabase(updatedData);

      const updatedStoredData = storedData.map((item: any, index: number) => {
        if (item?.service_name === defaultValue?.name) {
          const newData = {
            ...item,
            title: data?.released_information?.title,
            name: item?.name,
            episode_start: epStart,
            episode_end: item?.number_of_episodes || epEnd,
            air_date: data?.released_information?.air_date,
          };
          if (newData) {
            const newState = [...isItemDataChanged];
            newState[index] = true; // Assuming `index` is the index of the item that changed
            setIsItemDataChanged(newState);
          }
          return newData;
        }
        return item;
      });

      setStoredData(updatedStoredData);
      setOpenEditModal(false);
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    }
  };

  const markForDeletionSeason = (
    idx: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const newMarkedForDeletion = [...markedForDeletion];
    newMarkedForDeletion[idx] = !newMarkedForDeletion[idx]; // Toggle the deletion status
    setMarkedForDeletion(newMarkedForDeletion);
    setOpenEditModal(false);
  };

  const handleDeleteStoredData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Remove the item at the specified index (idx) from the storedData array
    const updatedStoredData = storedData.filter(
      (item, index) => item?.title !== defaultValue?.title
    );
    setStoredData(updatedStoredData);
    // Close the modal after deletion
    setOpenEditModal(false);
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen bg-black bg-opacity-10">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-[550px] transform rounded-lg bg-white text-left  transition-all my-2">
            <div className="bg-white dark:bg-[#242526] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-md">
              <div className="sm:flex sm:items-center justify-between">
                <div className="flex items-center justify-between">
                  <h1>Edit Item</h1>
                </div>
                <button onClick={() => setOpenEditModal(false)}>
                  <IoClose />
                </button>
              </div>
              <div className="text-[#ffffff99] text-md break-words px-5 py-7">
                <form action="">
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
                          className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#c0c4cc] rounded-md outline-none py-2 px-4"
                          placeholder={
                            defaultValue?.title || storedData[idx]?.title
                          }
                          defaultValue={
                            defaultValue?.title || storedData[idx]?.title
                          }
                        />
                        <small className="text-muted-foreground opacity-80">
                          The name can be either year or the season number.
                        </small>
                      </div>
                      {errors?.released_information?.title && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errors?.released_information?.title?.message}
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
                        <span className="text-red-500 pr-1">*</span>Episode
                        Start
                      </b>
                    </label>
                    <div className="relative ml-[150px]">
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#c0c4cc] rounded-md outline-none py-2 px-4"
                          value={epStart}
                          onChange={(e) => setEpStart(Number(e.target.value))}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b-[1px] border-b-[#c0c4cc] dark:border-b-[#46494a] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] border-t-[1px] dark:border-t-0 border-t-[#c0c4cc] dark:border-t-[#46494a] border-r-[1px] dark:border-r-0 border-r-[#c0c4cc] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                              epStart === defaultValue?.episode_start &&
                              "cursor-not-allowed"
                            }`}
                            onClick={handleEpStartIncrement}
                            disabled={epStart === defaultValue?.episode_start}
                          >
                            <IoMdArrowDropup className="" />
                          </button>
                          <button
                            type="button"
                            className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
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
                          value={
                            isEpEnd
                              ? epEnd
                              : storedData[idx]?.episode_end ||
                                defaultValue?.episode_end ||
                                item?.map(
                                  (data) => data?.number_of_episodes as any
                                )
                          }
                          onChange={(e) => setEpEnd(Number(e.target.value))}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className={`block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b-[1px] border-b-[#c0c4cc] dark:border-b-[#46494a] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] border-t-[1px] dark:border-t-0 border-t-[#c0c4cc] dark:border-t-[#46494a] border-r-[1px] dark:border-r-0 border-r-[#c0c4cc] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group ${
                              epEnd === defaultValue?.episode_end &&
                              "cursor-not-allowed"
                            }`}
                            onClick={handleEpEndIncrement}
                            disabled={epEnd === defaultValue?.episode_end}
                          >
                            <IoMdArrowDropup className="" />
                          </button>
                          <button
                            type="button"
                            className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
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
                                placeholderText={
                                  defaultValue?.air_date ||
                                  storedData[idx]?.air_date
                                }
                                onChange={(date) => {
                                  // Format the date as YYYY-MM-DD before calling field.onChange()
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
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-end justify-between">
                <button
                  className="bg-[#f56c6c4d] text-sm text-white dark:text-[#f56c6c] border-[1px] border-[#f56c6c4d] rounded-sm px-5 py-3"
                  onClick={(e: any) => {
                    storedData?.length > 0
                      ? handleDeleteStoredData(e)
                      : markForDeletionSeason(idx, e);
                  }}
                >
                  Delete
                </button>
                <button
                  className="bg-[#409eff] text-sm text-white border-[1px] border-[#409eff] rounded-sm px-5 py-3"
                  onClick={handleSubmit(updatingItems)}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSeasonModal;
