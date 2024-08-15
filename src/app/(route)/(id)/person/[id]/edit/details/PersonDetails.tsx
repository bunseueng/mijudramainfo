"use client";

import React, { useEffect, useRef, useState } from "react";
import { PersonEditList } from "./PersonEditList";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { Controller, useForm } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePersonDetails, TCreatePersonDetails } from "@/helper/zod";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { nationalityList, person_gender } from "@/helper/item-list";
import ClipLoader from "react-spinners/ClipLoader";
import { FaRegTrashAlt } from "react-icons/fa";
import { mergeAndRemoveDuplicates } from "@/app/actions/mergeAndRemove";
import { toast } from "react-toastify";
import { PersonDetail } from "@/helper/type";

const PersonDetails: React.FC<PersonEditList> = ({ person_id, personDB }) => {
  const { data: person } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
  });
  const { register, handleSubmit, reset, control } =
    useForm<TCreatePersonDetails>({
      resolver: zodResolver(CreatePersonDetails),
    });
  const [detailDB]: PersonDetail[] = (personDB?.details ||
    []) as unknown as PersonDetail[];
  const initialStageName = personDB?.name || person?.name || "";
  const initialFirstName =
    detailDB?.first_name || person?.name?.split(" ")[1] || "";
  const initialLastName =
    detailDB?.last_name || person?.name?.split(" ")[0] || "";
  const initialNativeName = detailDB?.native_name || "";
  const initialNationality = detailDB?.nationality || "";
  const initialGender =
    detailDB?.gender || (person?.gender === 0 ? "Male" : "Female") || "";
  const initialBiography = detailDB?.biography || person?.biography || "";
  const initialBirthday = detailDB?.birthday || person?.birthday || "";
  const initialDeathDay = detailDB?.deathday || person?.deathday || "";
  const initialTitleResults = person?.also_known_as || "";
  const initialKnownAsDetails = detailDB?.also_known_as || "";
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>("");
  const [nationality, setNationality] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [titleResults, setTitleResults] = useState<any[]>([]);
  const [knownAsDetails, setKnownAsDetails] = useState<string[]>([]);
  const [currentStageName, setCurrentStageName] = useState(initialStageName);
  const [currentFirstName, setCurrentFirstName] = useState(initialFirstName);
  const [currentLastName, setCurrentLastName] = useState(initialLastName);
  const [currentNativeName, setCurrentNativeName] = useState(initialNativeName);
  const [currentNationality, setCurrentNationality] = useState(nationality);
  const [currentGender, setCurrentGender] = useState(gender);
  const [currentTitleResults, setCurrentTitleResults] = useState(titleResults);
  const [currentKnownAsDetails, setCurrentKnownAsDetails] =
    useState(knownAsDetails);
  const [currentBiography, setCurrentBiography] = useState(initialBiography);
  const [currentBirthday, setCurrentBirthday] = useState(initialBirthday);
  const [currentDeathday, setCurrentDeathday] = useState(initialDeathDay);
  const originalStageName = initialStageName;
  const originalFirstName = initialFirstName;
  const originalLastName = initialLastName;
  const originalNativeName = initialNativeName;
  const originalNationality = initialNationality;
  const originalGender = initialGender;
  const originalBiography = initialBiography;
  const originalBirthday = initialBirthday;
  const originalDeathDay = initialDeathDay;
  const originalTitleResults = initialTitleResults;
  const originalKnownAsDetails = initialKnownAsDetails;

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const arraysEqual = (arr1: any[] | undefined, arr2: any[] | undefined) => {
    // Handle cases where one or both arrays are undefined
    if (arr1 === undefined && arr2 === undefined) return true;
    if (arr1 === undefined || arr2 === undefined) return false;
    // Handle cases where one or both arrays are empty
    if (arr1.length !== arr2.length) return false;
    // Compare elements of the arrays
    for (let i = 0; i < arr1.length; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
    }
    return true;
  };
  useEffect(() => {
    const hasChanged =
      currentStageName !== originalStageName ||
      currentFirstName !== originalFirstName ||
      currentLastName !== originalLastName ||
      currentNativeName !== originalNativeName ||
      currentNationality !== originalNationality ||
      currentGender !== originalGender ||
      currentBiography !== originalBiography ||
      currentBirthday !== originalBirthday ||
      currentDeathday !== originalDeathDay ||
      !arraysEqual(currentTitleResults, originalTitleResults) ||
      !arraysEqual(currentKnownAsDetails, originalKnownAsDetails as any);
    setIsSubmitEnabled(hasChanged);
  }, [
    currentStageName,
    currentFirstName,
    currentLastName,
    currentNativeName,
    currentNationality,
    currentGender,
    currentBirthday,
    currentDeathday,
    currentTitleResults,
    currentKnownAsDetails,
    currentBiography,
    originalStageName,
    originalFirstName,
    originalLastName,
    originalNativeName,
    originalNationality,
    originalGender,
    originalTitleResults,
    originalBiography,
    originalKnownAsDetails,
    originalBirthday,
    originalDeathDay,
  ]);

  useEffect(() => {
    setCurrentStageName(initialStageName);
    setCurrentFirstName(initialFirstName);
    setCurrentLastName(initialLastName);
    setCurrentNativeName(initialNativeName);
    setCurrentNationality(initialNationality);
    setCurrentGender(initialGender);
    setCurrentBiography(initialBiography);
    setCurrentTitleResults(titleResults);
    setCurrentKnownAsDetails(knownAsDetails);
    setCurrentBirthday(initialBirthday);
    setCurrentDeathday(initialDeathDay);
  }, [
    initialStageName,
    initialFirstName,
    initialLastName,
    initialNativeName,
    initialNationality,
    initialGender,
    initialBiography,
    initialBirthday,
    initialDeathDay,
    titleResults,
    knownAsDetails,
  ]);

  useEffect(() => {
    if (person?.also_known_as) {
      setTitleResults(person.also_known_as);
    }
    if (detailDB?.also_known_as) {
      setKnownAsDetails(detailDB.also_known_as as any);
    }
  }, [person, detailDB]);

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown(openDropdown === type ? "" : type);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if (e.key === "Enter") {
      e.preventDefault();
      if (value !== "" && !results.includes(value)) {
        setResults((prevResults) => [...prevResults, value]);
      } else if (value !== "" && !titleResults.includes(value)) {
        setTitleResults((prevResults) => [...prevResults, value]);
      } else if (value !== "" && !knownAsDetails.includes(value)) {
        setKnownAsDetails((prevResults) => [...prevResults, value]);
      }
      e.currentTarget.value = "";
    } else if (e.key === "Backspace" && e.currentTarget.value === "") {
      setResults((prevResults) => prevResults.slice(0, -1));
      setTitleResults((prevResults) => prevResults.slice(0, -1));
      setKnownAsDetails((prevResults) => prevResults.slice(0, -1));
    }
  };

  const handleRemoveResult = (index: number) => {
    setResults((prevResults) => prevResults.filter((_, i) => i !== index));
  };

  const handleRemoveTitleResult = (index: number) => {
    setTitleResults((prevResults) => prevResults.filter((_, i) => i !== index));
  };

  const handleRemoveKnownAsDetail = (index: number) => {
    setKnownAsDetails((prevDetails) => {
      const updatedDetails = prevDetails.filter((_, i) => i !== index);
      console.log("Updated Known As Details:", updatedDetails); // Debug output
      return updatedDetails;
    });
  };

  const onSubmit = async (data: TCreatePersonDetails) => {
    try {
      setLoading(true);
      const ensureAllStrings = (arr: any[]) =>
        arr.flat().filter((item) => typeof item === "string");
      const newKnownAs = mergeAndRemoveDuplicates(
        results,
        currentKnownAsDetails,
        currentTitleResults
          ?.filter((title) => !knownAsDetails?.includes(title))
          ?.flatMap((item) => item)
      );
      // Flatten and ensure all items are strings
      const formattedKnownAs = ensureAllStrings(newKnownAs);
      const res = await fetch(`/api/person/${person_id}/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId: person_id.toString(),
          details: [
            {
              stage_name: initialStageName || data?.details?.stage_name,
              first_name: initialFirstName || data?.details?.first_name,
              last_name: initialLastName || data?.details?.last_name,
              native_name: initialNativeName || data?.details?.native_name,
              nationality: nationality || data.details?.nationality,
              gender: initialGender || data?.details?.gender,
              also_known_as: formattedKnownAs,
              biography: initialBiography || data?.details?.biography,
              birthday: initialBirthday || data?.details?.birthday,
              date_of_death: initialDeathDay || data?.details?.date_of_death,
            },
          ],
        }),
      });
      if (res.status === 200) {
        reset();
        setResults([]);
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Bad Request");
      }
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setResetLoading(true);
      // Simulate a delay for the reset operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // reset logic here
      reset();
      setCurrentStageName(originalStageName);
      setCurrentFirstName(originalFirstName);
      setCurrentLastName(originalLastName);
      setCurrentNativeName(originalNativeName);
      setCurrentNationality(originalNationality);
      setCurrentGender(originalGender);
      setCurrentBiography(originalBiography);
      setResults([]);
      setTitleResults(originalTitleResults);
      setCurrentBirthday(originalBirthday);
      setCurrentDeathday(originalDeathDay);
    } catch (error) {
      console.error("Error resetting:", error);
    } finally {
      setResetLoading(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    adjustTextareaHeight();
  }, [currentBiography]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Primary Details
      </h1>
      <div className="mb-5 px-3">
        <label htmlFor="stage_name">
          <b>Stage Name (English if available)*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <input
            {...register("details.stage_name")}
            name="details.stage_name"
            type="text"
            className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
            onChange={(e) => setCurrentStageName(e.target.value)}
            defaultValue={initialStageName}
          />
        </div>
        <small className="text-muted-foreground opacity-80">
          This is the transliterated name the person goes by. Also remember in
          asian countries, the last name appears first (eg. Ju Jing Yi).
        </small>
      </div>
      <div className="w-full inline-flex items-center">
        <div className="w-[50%] mb-5 px-3">
          <label htmlFor="birth_name.">
            <b>Birth Name *</b>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("details.first_name")}
              name="details.birth_name"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
              onChange={(e) => setCurrentFirstName(e.target.value)}
              defaultValue={initialFirstName}
            />
          </div>
        </div>
        <div className="w-[50%] px-3 mt-1">
          <div className="inline-block align-bottom relative w-full mt-1">
            <input
              {...register("details.last_name")}
              name="details.birth_name"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
              onChange={(e) => setCurrentLastName(e.target.value)}
              defaultValue={initialLastName}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-[50%] mb-5 px-3">
          <label htmlFor="native_name">
            <b>Native Name *</b>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("details.native_name")}
              name="details.native_name"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none py-2 px-4"
              onChange={(e) => setCurrentNativeName(e.target.value)}
              defaultValue={initialNativeName}
            />
          </div>{" "}
          <small className="text-muted-foreground opacity-80">
            Original language name (Native Language) only
          </small>
        </div>
        <div className="w-full md:w-[25%] mb-5 px-3">
          <label htmlFor="nationality">
            <b>Nationality *</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.nationality")}
                type="text"
                name="details.nationality"
                readOnly
                autoComplete="off"
                placeholder={
                  nationality || person?.place_of_birth?.split(",")[2]
                }
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("nationality")}
                defaultValue={
                  nationality || person?.place_of_birth?.split(",")[2]
                }
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "nationality" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll person_custom_scroll"
                >
                  {nationalityList?.map((item, idx) => {
                    const isContentRating = nationality
                      ? nationality === item?.value
                      : detailDB?.nationality === item?.value;
                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isContentRating
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        } `}
                        onClick={(e) => {
                          handleDropdownToggle("nationality");
                          setNationality(item?.value);
                          setCurrentNationality(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.value}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
        <div className="w-full md:w-[25%] mb-5 px-3">
          <label htmlFor="gender">
            <b>Gender *</b>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                {...register("details.gender")}
                type="text"
                name="details.gender"
                readOnly
                autoComplete="off"
                placeholder={gender || person?.gender === 0 ? "Male" : "Female"}
                className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                onClick={() => handleDropdownToggle("gender")}
                value={gender || (person?.gender === 0 ? "Male" : "Female")}
                key={gender}
              />
              <IoIosArrowDown className="absolute bottom-3 right-2" />
            </div>
            {openDropdown === "gender" && (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll person_custom_scroll"
                  style={{ height: "100px" }}
                >
                  {person_gender?.map((item, idx) => {
                    const isContentRating = gender
                      ? gender === item?.value
                      : person?.gender
                      ? person?.gender === 0
                        ? "Male"
                        : "Female" === item?.value
                      : detailDB?.gender === item?.value;
                    return (
                      <li
                        className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                          isContentRating
                            ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                            : "text-black dark:text-white"
                        } `}
                        onClick={(e) => {
                          handleDropdownToggle("gender");
                          setGender(item?.value);
                          setCurrentGender(item?.value);
                        }}
                        key={idx}
                      >
                        {item?.value}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="mb-5 px-3">
        <label htmlFor="known_as">
          <b>Also Known As*</b>
        </label>
        <div className="flex flex-wrap relative w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#2196f3] rounded-md outline-none py-1 px-2 overflow-hidden">
          {titleResults
            ?.filter((known_as) => !knownAsDetails?.includes(known_as))
            ?.map((item, idx: number) => (
              <div
                key={idx}
                className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
              >
                {item}
                <button
                  className="ml-1 text-red-500"
                  onClick={() => handleRemoveTitleResult(idx)}
                  type="button"
                >
                  x
                </button>
              </div>
            ))}
          {results?.map((result, index: number) => (
            <div
              key={index}
              className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
            >
              {result}
              <button
                className="ml-1 text-red-500"
                onClick={() => handleRemoveResult(index)}
                type="button"
              >
                x
              </button>
            </div>
          ))}
          {Array.isArray(knownAsDetails) &&
            knownAsDetails?.map((title, index: number) => (
              <div
                key={index}
                className="text-sm text-[#373a3c] dark:text-white bg-[#e4e7ed] dark:bg-transparent rounded-sm px-2 mr-2 my-2"
              >
                {title}
                <button
                  className="ml-1 text-red-500"
                  onClick={() => handleRemoveKnownAsDetail(index)}
                  type="button"
                >
                  x
                </button>
              </div>
            ))}
          <input
            type="text"
            className="bg-transparent text-[#777] border-none text-sm outline-none pr-1 flex-grow ml-4 my-2"
            placeholder="Eg: Kikuchanj, 鞠婧祎"
            onKeyDown={handleKeyDown}
          />
        </div>
        <small className="text-muted-foreground opacity-80">
          Other names this person is known as/different ways to spell the name.
        </small>
      </div>

      <div className="mb-5 px-3">
        <label htmlFor="biography">
          <b>Biography*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <textarea
            {...register("details.biography")}
            name="details.biography"
            ref={textareaRef}
            className="w-full h-auto bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none overflow-hidden px-4 py-1"
            onChange={(e) => setCurrentBiography(e.target.value)}
            defaultValue={initialBiography}
          ></textarea>
        </div>
        <small className="text-muted-foreground opacity-80">
          If you&apos;re copying and pasting a Biography from another site,
          please reference it at the bottom! Example:(Source: MyDramaList)
        </small>
      </div>
      <div className="mb-5 px-3">
        <label htmlFor="birthday">
          <b>Birthday*</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <div className="relative">
            <Controller
              control={control}
              {...register("details.birthday")}
              name="details.birthday"
              render={({ field }) => {
                return (
                  <ReactDatePicker
                    placeholderText={initialBirthday || "YYYY-MM-DD"}
                    onChange={(
                      date,
                      e: React.SyntheticEvent<any, Event> | undefined
                    ) => {
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
                      const target = e?.target as HTMLInputElement;
                      setCurrentBirthday(formattedDate);
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
      <div className="mb-5 px-3">
        <label htmlFor="day_of_death">
          <b>Day of Death *</b>
        </label>
        <div className="inline-block relative w-full mt-1">
          <div className="relative">
            <Controller
              control={control}
              {...register("details.date_of_death")}
              name="details.date_of_death"
              render={({ field }) => {
                return (
                  <ReactDatePicker
                    placeholderText={initialDeathDay || "YYYY-MM-DD"}
                    onChange={(
                      date,
                      e: React.SyntheticEvent<any, Event> | undefined
                    ) => {
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
                      const target = e?.target as HTMLInputElement;
                      setCurrentDeathday(formattedDate);
                    }}
                    selected={field.value as any}
                    className="w-full text-black dark:text-white bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="inline-flex mt-5">
          <button
            type="submit"
            className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 mr-5 ${
              isSubmitEnabled || results?.length > 0
                ? "cursor-pointer"
                : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
            }`}
            disabled={isSubmitEnabled || results?.length > 0 ? false : true}
          >
            <span className="mr-1 pt-1">
              <ClipLoader color="#fff" loading={loading} size={19} />
            </span>
            Submit
          </button>
          <button
            className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
              isSubmitEnabled || results?.length > 0
                ? "cursor-pointer"
                : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
            }`}
            onClick={(e) => handleReset(e)}
            disabled={isSubmitEnabled || results?.length > 0 ? false : true}
          >
            {resetLoading ? (
              <span className="pt-1 mr-1">
                <ClipLoader color="#fff" loading={!loading} size={19} />
              </span>
            ) : (
              <span className="mr-1">
                <FaRegTrashAlt />
              </span>
            )}
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonDetails;
