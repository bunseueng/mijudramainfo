"use client";

import {
  fetchAllCast,
  fetchMultiSearch,
  fetchPerson,
  fetchPersonCombinedCredits,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { castRole, personTVShowRole } from "@/helper/item-list";
import { CastType } from "@/helper/type";
import { CreatePersonDetails, TCreatePersonDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { GrPowerReset } from "react-icons/gr";
import { PersonEditList } from "../details/PersonEditList";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);
const DramaRegion = dynamic(
  () => import("@/app/(route)/lists/[listId]/edit/DramaRegion"),
  { ssr: false }
);

const determineRole = (cast: any, totalEpisodes: number) => {
  const guestRoleThreshold = 0.8; // 80%
  // Calculate the threshold for a guest role
  const thresholdEpisodes = totalEpisodes * guestRoleThreshold;
  // Check if the person appears in less than the threshold number of episodes
  if (totalEpisodes > 70) {
    if (cast.order < 6) {
      return "Regular Member";
    } else {
      // Default to Support Role
      return "Guest";
    }
    if (
      cast?.roles?.some((role: any) => role?.episode_count < thresholdEpisodes)
    ) {
      return "Guest";
    }
  } else {
    if (
      cast?.roles?.some((role: any) => role?.episode_count < thresholdEpisodes)
    ) {
      return "Guest Role";
    }
    // Check if the person has a high order and should be a Main Role
    if (cast.order < 2) {
      return "Main Role";
    }
    // Default to Support Role
    return "Support Role";
  }
};

const PersonCast: React.FC<PersonEditList> = ({ person_id, personDB }) => {
  const { data: personDetails } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const { data: person, isLoading } = useQuery({
    queryKey: ["personCredits", person_id],
    queryFn: () => fetchPersonCombinedCredits(person_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });
  const tvid = person?.cast?.map((item: any) => item?.id);
  const { data: castData } = useQuery({
    queryKey: ["tv_cast", tvid],
    queryFn: async () => {
      if (!tvid || tvid.length === 0) {
        console.log("No TV IDs found.");
        return {};
      }
      try {
        // Fetch all cast data concurrently
        const allCasts = await Promise.all(
          tvid.map(async (id: any) => {
            try {
              const castData = await fetchAllCast(id);
              return { [id]: castData?.cast || [] };
            } catch (fetchError) {
              console.error(
                `Error fetching cast data for TV ID ${id}:`,
                fetchError
              );
              return { [id]: [] }; // Return an empty array for the specific TV ID if an error occurs
            }
          })
        );
        // Combine results into a single object
        const castObject = allCasts.reduce((acc, current) => {
          return { ...acc, ...current };
        }, {});

        return castObject;
      } catch (error) {
        console.error("Error in the Promise.all execution:", error);
        return {};
      }
    },
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    enabled: !!tvid && tvid.length > 0,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [castRoles, setCastRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [character, setCharacter] = useState<string[]>(
    person?.cast?.map((role: any) => role?.character) || []
  );
  const [tvIds, setTvIds] = useState<number[]>(person_id ? [] : []);
  const [prevCastRoles, setPrevCastRoles] = useState<string[]>([]);
  const [prevCharacter, setPrevCharacter] = useState<string[]>([]);
  const [inputChanged, setInputChanged] = useState(new Set());
  const [inputFocused, setInputFocused] = useState<number | null>(null);
  const inputRefs = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(personDB?.cast?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(personDB?.cast?.length || 0).fill(false)
  );
  const searchQueries = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchQueries?.get("query") || "";
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<TCreatePersonDetails>({
    resolver: zodResolver(CreatePersonDetails),
  });

  const {
    data: searchMulti,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["multiSearch"],
    queryFn: () => fetchMultiSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: tvAndMovieResult = [], refetch: refetchData } = useQuery({
    queryKey: ["tvAndMovieResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvIds.map(async (id: number) => await fetchTv(id))
      );
      return [...tvDetails];
    },
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    enabled: true,
  });
  const filterDuplicates = (arr: any) => {
    const uniqueIds = new Set();
    return arr.filter((item: any) => {
      if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
  };

  const [storedData, setStoredData] = useState<CastType[]>([]);

  useEffect(() => {
    if (tvAndMovieResult.length > 0) {
      setStoredData(tvAndMovieResult);
    }
  }, [tvAndMovieResult]);

  const [item, setItem] = useState(() =>
    [...(personDB?.cast || []), ...storedData].length > 0
      ? [...(personDB?.cast || []), ...storedData]
      : person?.cast || []
  );

  useEffect(() => {
    if (!isLoading && person && person.crew) {
      if (personDB?.cast?.length && personDB?.cast?.length > 0) {
        setItem(filterDuplicates([...(personDB?.cast || []), ...storedData]));
      } else {
        setItem(
          filterDuplicates([
            ...(personDB?.cast || []),
            ...person?.cast,
            ...storedData,
          ])
        );
      }
    }
  }, [isLoading, person, storedData, personDB?.cast]);

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setCastRole = (idx: number, role: string) => {
    setPrevCastRoles((prev) => {
      const newRoles = [...castRoles];
      newRoles[idx] = role;
      return [...prev];
    });
    setCastRoles((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      setIsItemChanging(newRoles as any);
      return newRoles;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target as Node)
      ) {
        setListSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClickAddMovie = async (id: string, mediaType: string) => {
    if (tvid?.includes(id)) {
      setListSearch("");
      toast.error("You cannot add duplicate entry");
      return false;
    }
    const parsedId = parseInt(id, 10);
    if (mediaType === "tv" && !tvIds.includes(parsedId)) {
      setTvIds((prevTvIds) => [...prevTvIds, parsedId]);
      setListSearch(""); // Clear the search input
    }
    try {
      const tvDetail = await fetchTv(parsedId);
      setItem((prevItems: any) => [...prevItems, tvDetail]);
      setListSearch("");
    } catch (error) {
      console.error("Error adding related title:", error);
      toast.error("Failed to add related title.");
    }
  };

  const handleRemoveItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indexToRemove: number
  ) => {
    e.preventDefault();
    setItem((prevItems: any) =>
      prevItems.filter((_: any, idx: number) => idx !== indexToRemove)
    );
  };

  const onInput = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setLoading(true);
      setListSearch(value);
      const params = new URLSearchParams(searchQuery as string | any);

      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      router.push(`${pathname}/?${params.toString()}`, {
        scroll: false,
      });
    },
    300
  );

  const onSubmit = async (data: TCreatePersonDetails) => {
    if (!data.cast) {
      toast.error("No cast data provided");
      return;
    }
    try {
      setSubmitLoading(true);
      const updatedItems = item
        ?.filter((_: any, idx: number) => !markedForDeletion[idx])
        .map((cast: any, index: number) => {
          const updatedCast = { ...cast };
          if (castRoles?.length > 0 && castRoles[index] !== undefined) {
            updatedCast.cast_role = castRoles[index];
          }
          if (character?.length > 0 && character[index] !== undefined) {
            updatedCast.character = character[index];
          }
          return updatedCast;
        });

      const res = await fetch(`/api/person/${person_id}/cast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId: person_id.toString(),
          cast: updatedItems,
        }),
      });
      if (res.status === 200) {
        router.refresh();
        reset();
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
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRefs.current &&
        !inputRefs.current.contains(event.target as Node)
      ) {
        setInputFocused(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCharacterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    // Store the current character array only once before updating
    setPrevCharacter((prevCharacter: any) =>
      prevCharacter.length === 0 ? [...character] : prevCharacter
    );
    // Update the specific character value
    setCharacter((prevCharacter) => {
      const newCharacter = [...prevCharacter];
      newCharacter[index] = newValue;
      return newCharacter;
    });
    // Track the input change
    setInputChanged((prevChanged) => {
      const newChanged = new Set(prevChanged);
      newChanged.add(index);
      return newChanged;
    });
  };

  const handleFocus = (index: number) => {
    setInputFocused(index);
  };
  const handleBlur = () => {
    setInputFocused(null);
  };

  const handleResetChanges = (ind: number) => {
    setIsItemChanging((prevIsItemChanging) => {
      const newIsItemChanging = [...prevIsItemChanging];
      newIsItemChanging[ind] = false;
      return newIsItemChanging;
    });
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === ind ? false : marked))
    );
    setCastRoles((prevCastRole) => {
      const newRole = [...prevCastRole];
      newRole[ind] = prevCastRoles[ind];
      return newRole;
    });
    setCharacter((prevCharacters) => {
      const newCharacter = [...prevCharacters];
      newCharacter[ind] = prevCharacter[ind];
      return newCharacter;
    });
    setInputChanged((prevChanged) => {
      const newChanged = new Set(prevChanged);
      newChanged.delete(ind); // Remove the index from the changed set
      return newChanged;
    });
    setPrevCharacter([]);
  };

  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <form className="py-3 px-4">
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">Cast</h1>
      <div className="text-left">
        <table className="w-full max-w-full border-collapse bg-transparent mb-4">
          <thead>
            <tr>
              <th
                className="w-[235px] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                colSpan={2}
              >
                Person
              </th>
              <th className="w-[235px] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Role
              </th>
              <th className="w-[235px] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Character
              </th>
              <th className="w-[112px] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
            </tr>
          </thead>
          <Reorder.Group
            as="tbody"
            values={item}
            onReorder={setItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {item?.length > 0 ? (
                item?.map((cast: any, ind: number) => {
                  const castId = cast?.id;
                  let data;
                  if (castId && castData && castData[castId]) {
                    const matchingData = castData[castId];
                    data = matchingData;
                  } else {
                    console.log(`No matching data found for ID: ${castId}`);
                  }
                  const findRole = data?.filter(
                    (item: any) => item?.name === personDetails?.name
                  );
                  const roleLogic = findRole?.reduce((acc: any, item: any) => {
                    acc[item.name] = determineRole(item, cast?.episode_count);
                    return acc;
                  }, {});
                  const personName = personDetails?.name?.toString(); // Replace with the desired person's name
                  const roles = roleLogic && roleLogic[personName];
                  const role = castRoles[ind];
                  const roleFromApi =
                    cast?.order < 2 ? "Main Role" : "Support Role";
                  const isNew = tvAndMovieResult?.some(
                    (result) => result.id === cast.id
                  );
                  const isChanged = inputChanged.has(ind);
                  const isFocused = inputFocused === ind;
                  return (
                    <Reorder.Item
                      as="tr"
                      value={cast}
                      key={cast.id}
                      whileDrag={{
                        scale: 1.0,
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                        backgroundColor: "#c2e7b0",
                      }}
                      className="relative w-full"
                      style={{ display: "table-row" }}
                    >
                      <td className="w-3 border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-2 py-3">
                        {!markedForDeletion[ind] && (
                          <span
                            className={`pr-3 inline-block ${
                              isNew && "text-green-500"
                            } ${isItemChanging[ind] && "text-blue-500"}`}
                          >
                            <GiHamburgerMenu />
                          </span>
                        )}
                      </td>
                      <td className="border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pr-2 py-3">
                        <div className="flex items-start w-full">
                          <div className="flex-1">
                            <div className="float-left pr-4">
                              <Image
                                src={
                                  cast?.poster_path ||
                                  cast?.backdrop_path === null
                                    ? `https://image.tmdb.org/t/p/original/${
                                        cast?.poster_path || cast?.backdrop_path
                                      }`
                                    : "/empty-pf.jpg"
                                }
                                alt={cast?.name}
                                width={500}
                                height={500}
                                quality={100}
                                className="block w-10 h-10 bg-center bg-cover object-cover leading-10 rounded-full align-middle pointer-events-none"
                              />
                            </div>
                            <div>
                              <b>
                                <Link
                                  href={`/tv/${cast?.id}`}
                                  className={`w-full text-sm font-normal  ${
                                    isNew && "text-green-500"
                                  } ${isFocused ? "ring-blue-500" : ""} ${
                                    isChanged
                                      ? "text-blue-500"
                                      : "border-gray-300"
                                  } ${
                                    markedForDeletion[ind] &&
                                    "text-red-500 line-through"
                                  }`}
                                >
                                  {cast?.title || cast?.name}
                                </Link>
                              </b>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-left border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              name="cast_role"
                              readOnly
                              autoComplete="off"
                              className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                              placeholder={
                                role
                                  ? castRoles[ind]
                                  : cast?.cast_role?.length > 0
                                  ? cast?.cast_role
                                  : castRoles[ind] ||
                                    cast?.genre_ids?.includes(10764)
                                  ? ""
                                  : roles
                                  ? roles
                                  : roleFromApi
                              }
                              onClick={() =>
                                handleDropdownToggle("cast_role", ind)
                              }
                            />
                            <IoIosArrowDown className="absolute bottom-3 right-2" />
                          </div>
                          {openDropdown === `cast_role-${ind}` && (
                            <AnimatePresence>
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                                style={
                                  cast?.genre_ids?.includes(10764) ||
                                  cast?.episode_count > 70
                                    ? {
                                        height: "150px",
                                      }
                                    : {}
                                }
                              >
                                {cast?.episode_count > 70 ||
                                cast?.genre_ids?.includes(10764) ? (
                                  <>
                                    {personTVShowRole?.map((items, index) => {
                                      const isContentRating = role
                                        ? role === items?.value
                                        : cast?.cast_role?.length > 0
                                        ? cast?.cast_role === items?.value
                                        : roles
                                        ? roles === items?.value
                                        : roleFromApi === items?.value;

                                      return (
                                        <li
                                          className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                            isContentRating
                                              ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                              : "text-black dark:text-white"
                                          }`}
                                          onClick={() => {
                                            handleDropdownToggle(
                                              "cast_role",
                                              ind
                                            );
                                            setCastRole(ind, items?.value); // Update the story for this item
                                          }}
                                          key={index}
                                        >
                                          {items?.label}
                                        </li>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <>
                                    {castRole?.map((items, index) => {
                                      const isContentRating = role
                                        ? role === items?.value
                                        : cast?.cast_role?.length > 0
                                        ? cast?.cast_role === items?.value
                                        : roles
                                        ? roles === items?.value
                                        : roleFromApi === items?.value;

                                      return (
                                        <li
                                          className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                            isContentRating
                                              ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                              : "text-black dark:text-white"
                                          }`}
                                          onClick={() => {
                                            handleDropdownToggle(
                                              "cast_role",
                                              ind
                                            );
                                            setCastRole(ind, items?.value); // Update the story for this item
                                          }}
                                          key={index}
                                        >
                                          {items?.label}
                                        </li>
                                      );
                                    })}
                                  </>
                                )}
                              </motion.ul>
                            </AnimatePresence>
                          )}
                        </div>
                      </td>
                      <td className="text-left border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="relative">
                          <div className="relative">
                            <input
                              {...register(`cast.${ind}.character`)}
                              type="text"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleCharacterChange(e, ind)}
                              value={character[ind] || cast?.character}
                              onFocus={() => handleFocus(ind)}
                              onBlur={handleBlur}
                              defaultValue={
                                cast?.character ||
                                cast?.roles?.map((role: any) => role?.character)
                              }
                              onDragStart={(e) => e.stopPropagation()}
                              className="w-full text-[#606266] dark:text-white placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-right border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-4 py-3">
                        <div className="relative">
                          <div className="relative">
                            {markedForDeletion[ind] ||
                            isItemChanging[ind] ||
                            isChanged ? (
                              <button
                                type="button"
                                className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3 mt-1"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission
                                  handleResetChanges(ind);
                                }}
                              >
                                <GrPowerReset />
                              </button>
                            ) : (
                              <button
                                className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3 mt-1"
                                onClick={(e) => {
                                  setOpen(!open), e.preventDefault();
                                  setDeleteIndex(ind); // Set the index of the item to show delete button
                                }}
                              >
                                <IoCloseOutline />
                              </button>
                            )}
                            {open && deleteIndex === ind && (
                              <DeleteButton
                                setOpen={setOpen}
                                open={open}
                                handleRemoveItem={handleRemoveItem}
                                ind={ind}
                                setDeleteIndex={setDeleteIndex}
                                item={item}
                                storedData={storedData}
                                setStoredData={setStoredData as any}
                                markedForDeletion={markedForDeletion}
                                setMarkedForDeletion={setMarkedForDeletion}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </Reorder.Item>
                  );
                })
              ) : (
                <tr>
                  <td className="text-start text-sm py-2 px-4" colSpan={3}>
                    No records have been added.
                  </td>
                </tr>
              )}
              )
            </AnimatePresence>
          </Reorder.Group>
        </table>
      </div>
      <div className="text-left-p-4">
        <div className="float-right w-[50%]">
          <div className="block relative">
            <div className="relative w-full inline-block">
              <input
                type="text"
                className="w-full h-10 leading-10 placeholder:text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                placeholder="Search to add a shows or movies"
                ref={inputRef}
                onChange={onInput}
              />
              <span className="absolute right-3 top-3">
                <CiSearch />
              </span>
              {listSearch && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    ref={searchResultRef}
                    className={`w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll ${
                      openSearch === false ? "block" : "hidden"
                    }`}
                  >
                    {isFetching ? (
                      <div className="absolute top-[45%] left-[50%]">
                        <ClipLoader color="#fff" size={25} loading={loading} />
                      </div>
                    ) : (
                      <>
                        {searchMulti?.map((item: any, idx: number) => (
                          <div
                            className={`flex items-center text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer w-full ${
                              listSearch && "force-overflow"
                            }`}
                            key={idx}
                            onClick={() =>
                              onClickAddMovie(item?.id, item?.media_type)
                            }
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/original/${
                                item.poster_path || item.backdrop_path
                              }`}
                              alt="drama image"
                              width={50}
                              height={50}
                              quality={100}
                              className="bg-cover bg-center mx-4 my-3"
                            />
                            <div className="flex flex-col items-start w-full">
                              <p className="text-[#2490da]">
                                {item.name || item.title}
                              </p>
                              <h4>
                                <DramaRegion item={item} />
                              </h4>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit(onSubmit)}
        className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          tvIds?.length > 0 ||
          castRoles?.some((role) => role !== undefined) ||
          character?.some((role) => role !== undefined) ||
          markedForDeletion?.includes(true) ||
          isItemChanging?.includes(true)
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={
          tvIds?.length > 0 ||
          castRoles?.some((role) => role !== undefined) ||
          character?.some((role) => role !== undefined) ||
          markedForDeletion?.includes(true) ||
          isItemChanging?.includes(true)
            ? false
            : true
        }
      >
        {submitLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default PersonCast;
