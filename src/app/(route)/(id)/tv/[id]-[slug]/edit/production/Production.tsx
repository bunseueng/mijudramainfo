"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import {
  options,
  production_country,
  production_language,
} from "@/helper/item-list";
import { Drama, tvId } from "@/helper/type";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { customStyles, lightTheme } from "@/helper/MuiStyling";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

const Production: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv = [] } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [database, setDatabase] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState<string[]>([]);
  const [countries, setCountries] = useState<{ value: string }[]>([]);
  const [originalLanguage, setOriginalLanguage] = useState<string[]>([]);
  const [originalCountries, setOriginalCountries] = useState<
    { value: string }[]
  >([]);
  const [originalNetwork, setOriginalNetwork] = useState<{ value: string }[]>(
    []
  );
  const [network, setNetwork] = useState<{ value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCountries, setOpenCountries] = useState<boolean>(false);
  const [openNetwork, setOpenNetwork] = useState<boolean>(false);
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(tvDetails?.production_information?.length).fill(false)
  );
  const { resolvedTheme } = useTheme();
  const router = useRouter();

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
  };

  const changeHandler = (value: any) => {
    setCountries(value);
  };

  const networkHandler = (value: any) => {
    setNetwork(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/tv/${tv_id}/production`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv_id.toString(),
          production_information: [
            {
              language:
                language?.length > 0
                  ? language
                  : production_language?.find((p) =>
                      database?.some(
                        (i) => p?.original === i?.original_language
                      )
                    )?.value,
              country: countries,
              network: network,
            },
          ],
        }),
      });

      if (res?.status === 200) {
        toast.success("Success");
        router.refresh();
      }
    } catch (error: any) {
      throw new Error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      tvDetails?.production_information &&
      tvDetails?.production_information.length > 0
    ) {
      setDatabase(tvDetails?.production_information);
      setCountries(
        tvDetails?.production_information.flatMap(
          (info: any) => info?.country || []
        )
      );
      setNetwork(
        tvDetails?.production_information.flatMap(
          (info: any) => info?.network || []
        )
      );
      setOriginalNetwork(
        tvDetails?.production_information.flatMap(
          (info: any) => info?.network || []
        )
      );
    } else {
      setDatabase([tv]);
    }
  }, [tv, tvDetails?.production_information]);

  useEffect(() => {
    // Check if production_information exists in movieDetails
    const combinedData = tvDetails?.production_information || [];

    if (combinedData.length > 0) {
      const countriesArray = combinedData.flatMap(
        (info: any) =>
          info?.country?.map((c: any) => ({
            label: c.label,
            value: c.value,
          })) || []
      );
      setOriginalCountries(countriesArray);
      // Only set state if there's new data
      if (countriesArray.length > 0) {
        setCountries(countriesArray);
        setDatabase(combinedData);
      }
    } else {
      const initialNetwork = tv?.networks?.map((net: any) => ({
        label: net.name,
        value: net.name,
      }));
      // Use existing database to get countries if no new data
      const countriesArray = database?.flatMap(
        (d: any) =>
          d?.production_countries?.map((c: any) => {
            const countryObj = production_country?.find(
              (p) => c?.name === p?.value
            );
            return countryObj
              ? { label: countryObj.value, value: countryObj.value }
              : null; // Return null if not found
          }) || [] // Provide an empty array if production_countries is undefined
      );
      setNetwork(initialNetwork);
      setOriginalNetwork(initialNetwork);
      // Set countries array only if it has valid values
      if (countriesArray.filter(Boolean).length > 0) {
        setOriginalCountries(countriesArray.filter(Boolean));
        setCountries(countriesArray.filter(Boolean));
      }
    }
  }, [tvDetails, database, tv.networks]);

  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Production Information
      </h1>
      {database?.map((data, idx) => {
        return (
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
                      language[idx] // If the user has selected a language, show the selected language
                        ? language[idx]
                        : data?.language?.length > 0
                        ? production_language?.find((i) =>
                            i?.value?.includes(data?.language[0])
                          )?.value
                        : production_language?.find(
                            (i) => i?.original === data?.original_language
                          )?.value
                    }
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
                      className={`w-full h-[250px] absolute text-black dark:text-white bg-white dark:bg-[#242424] border-[1px] border-[#c0c4cc] dark:border-[#242424] py-1 mt-2 rounded-md z-10  custom-scroll`}
                    >
                      {production_language?.map((items, index) => {
                        const scrollIntoViewIfNeeded = (element: any) => {
                          const rect = element?.getBoundingClientRect();
                          const isVisible =
                            rect?.top >= 0 &&
                            rect?.left >= 0 &&
                            rect?.bottom <=
                              (window?.innerHeight ||
                                document?.documentElement?.clientHeight) &&
                            rect?.right <=
                              (window?.innerWidth ||
                                document?.documentElement.clientWidth);

                          if (!isVisible) {
                            element?.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                              inline: "nearest",
                            });
                          }
                        };
                        const isContentRating = language[idx]
                          ? language[idx] === items?.value
                          : data?.language?.length > 0
                          ? items?.value?.includes(data?.language[0]) // Check if the selected language matches the item's value
                          : items?.original === data?.original_language;
                        return (
                          <li
                            ref={(el) => {
                              if (isContentRating) scrollIntoViewIfNeeded(el);
                            }}
                            className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                              isContentRating
                                ? "text-[#409eff] dark:bg-[#2a2b2c]"
                                : ""
                            } `}
                            onClick={() => {
                              handleDropdownToggle("job", idx);
                              setLanguages(idx, items?.value); // Update the story for this item
                            }}
                            key={index}
                          >
                            {items?.value}
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
                  onBlur={() => setOpenCountries(false)}
                  menuIsOpen
                  className="w-full production countries"
                  placeholder="Please enter a country name"
                />
              </div>
              <small className="text-muted-foreground opacity-60 ml-3">
                This is only for co-productions with 2 or more countries
                involved.
              </small>
            </div>
            <div className="mt-8">
              <label htmlFor="production_countries" className="mb-3 mx-3">
                <b>Original Network</b>
              </label>
              <div
                className="mx-3"
                onClick={() => setOpenNetwork(!openNetwork)}
              >
                <Select
                  isMulti
                  options={options}
                  value={network}
                  onChange={networkHandler}
                  styles={
                    resolvedTheme === "dark"
                      ? customStyles(openNetwork)
                      : lightTheme(openNetwork)
                  }
                  closeMenuOnSelect={false}
                  classNamePrefix="react-select"
                  onBlur={() => setOpenNetwork(false)}
                  menuIsOpen
                  className="w-full production"
                  placeholder="Please enter a country name"
                />
              </div>
              <small className="text-muted-foreground opacity-60 ml-3">
                Only use the original network where the series or program aired.
              </small>
            </div>
          </div>
        );
      })}
      <div className="border-t-2 border-t-[#78828c21] pt-5 mx-3">
        <button
          name="submit"
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            language?.length > 0 ||
            countries?.length !== originalCountries?.length ||
            network?.length !== originalNetwork?.length ||
            isItemDataChanged?.includes(true)
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            language?.length > 0 ||
            countries?.length !== originalCountries?.length ||
            network?.length !== originalNetwork?.length ||
            isItemDataChanged?.includes(true)
              ? false
              : true
          }
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Production;
