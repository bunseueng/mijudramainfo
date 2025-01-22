"use client";

import {
  fetchMovieCastCredit,
  fetchPerson,
  fetchPersonSearch,
} from "@/app/actions/fetchMovieApi";
import { castRole } from "@/helper/item-list";
import { CastType, Movie, movieId, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
import { FaRegTrashAlt } from "react-icons/fa";
import Image from "next/image";
import { Loader2 } from "lucide-react";
const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);

const determineRole = (cast: any) => {
  if (cast.order < 2) {
    return "Main Role";
  }
  return "Support Role";
};

const MovieCast: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const { data: cast, isLoading } = useQuery({
    queryKey: ["movie_cast", movie_id],
    queryFn: () => fetchMovieCastCredit(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [castRoles, setCastRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [character, setCharacter] = useState<string[]>(
    cast?.roles?.map((role: any) => role?.character) || []
  );
  const [movieIds, setMovieIds] = useState<number[]>(movie_id ? [] : []);
  const [prevCastRoles, setPrevCastRoles] = useState<string[]>([]);
  const [prevCharacter, setPrevCharacter] = useState<string[]>([]);
  const [inputChanged, setInputChanged] = useState(new Set());
  const [inputFocused, setInputFocused] = useState<number | null>(null);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(movieDetails?.cast?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(movieDetails?.cast?.length || 0).fill(false)
  );
  const inputRefs = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQueries = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchQueries?.get("query") || "";
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const fetchPersons = async (person_ids: any) => {
    const promises = person_ids.map((id: any) => fetchPerson(id));
    return Promise.all(promises);
  };
  const {
    data: searchPerson,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchPerson", searchQuery],
    queryFn: () => fetchPersonSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const person_ids =
    searchPerson?.results?.map((person: any) => person?.id) || [];

  const { data: persons } = useQuery({
    queryKey: ["persons", person_ids],
    queryFn: () => fetchPersons(person_ids),
    enabled: person_ids.length > 0, // only run query if there are person IDs
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: personResult = [], refetch: refetchData } = useQuery({
    queryKey: ["personResult"],
    queryFn: async () => {
      const personDetails = await Promise.all(
        movieIds.map(async (id: number) => await fetchPerson(id))
      );
      return [...personDetails];
    },
    enabled: true,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
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
    if (personResult.length > 0) {
      setStoredData(personResult);
    }
  }, [personResult]);

  const [item, setItem] = useState(() =>
    [...(movieDetails?.cast || []), ...storedData].length > 0
      ? [...(movieDetails?.cast || []), ...storedData]
      : cast?.cast || []
  );
  const [originalItems, setOriginalItems] = useState([...item]); // Keep the original order
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [hasReordered, setHasReordered] = useState(false); // Track if order has been changed

  useEffect(() => {
    if (!isLoading && cast && cast.crew) {
      if (movieDetails?.cast?.length && movieDetails?.cast?.length > 0) {
        setItem(
          filterDuplicates([...(movieDetails?.cast || []), ...storedData])
        );
      } else {
        setItem(
          filterDuplicates([
            ...(movieDetails?.cast || []),
            ...cast?.cast,
            ...storedData,
          ])
        );
      }
    }
  }, [isLoading, cast, storedData, movieDetails?.cast]);

  useEffect(() => {
    refetchData();
  }, [movieIds, refetchData]);

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

  const onClickAddMovie = async (id: string) => {
    const parsedId = parseInt(id, 10);
    setMovieIds((prevmovieIds) => [...prevmovieIds, parsedId]);
    setListSearch(""); // Clear the search input
    try {
      const personDetail = await fetchPerson(parsedId);
      setItem((prevItems: any) => [...prevItems, personDetail]);
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

  const onSubmit = async (data: TCreateDetails) => {
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

      const res = await fetch(`/api/movie/${movie_id}/cast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie_id.toString(),
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

  const handleReorder = (newOrder: any) => {
    setItem(newOrder); // Update the reordered items
  };

  const handleDragStart = () => {
    setIsDragging(true); // Set dragging state to true when any item starts dragging
  };

  const handleDragEnd = () => {
    setIsDragging(false); // Set dragging state to false after dragging ends
    // Check if the current order is different from the original order
    if (JSON.stringify(item) !== JSON.stringify(originalItems)) {
      setHasReordered(true); // Set to true if items have been reordered
    }
  };
  const handleResetChanges = async (i: number) => {
    setIsItemChanging((prevIsItemChanging) => {
      const newIsItemChanging = [...prevIsItemChanging];
      newIsItemChanging[i] = false;
      return newIsItemChanging;
    });
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === i ? false : marked))
    );
    setCastRoles((prevCastRole) => {
      const newRole = [...prevCastRole];
      newRole[i] = prevCastRoles[i];
      return newRole;
    });
    setCharacter((prevCharacters) => {
      const newCharacter = [...prevCharacters];
      newCharacter[i] = prevCharacter[i];
      return newCharacter;
    });
    setInputChanged((prevChanged) => {
      const newChanged = new Set(prevChanged);
      newChanged.delete(i); // Remove the index from the changed set
      return newChanged;
    });
    setPrevCharacter([]);
  };
  const handleResetAll = async () => {
    try {
      setResetLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCastRoles([]);
      setCharacter([]);
      setPrevCharacter([]);
      setHasReordered(false);
      setIsItemChanging([]);
      setMarkedForDeletion([]);
      setInputChanged(new Set());
      if (originalItems?.length > 0) {
        setItem(originalItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
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
            onReorder={handleReorder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {item?.map((cast: any, i: number) => {
                const roles = determineRole(cast);
                const role = castRoles[i];
                const isNew = personResult.includes(cast);
                const isChanged = inputChanged.has(i);
                const isFocused = inputFocused === i;
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
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="w-3 border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-2 py-3">
                      {!markedForDeletion[i] && (
                        <span
                          className={`pr-3 inline-block ${
                            isNew && "text-green-500"
                          } ${isItemChanging[i] && "text-blue-500"}`}
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
                                cast?.profile_path === null
                                  ? "/default-pf.jpg"
                                  : `https://image.tmdb.org/t/p/h632/${cast?.profile_path}`
                              }
                              alt={`${cast?.name}'s Profile`}
                              width={40}
                              height={40}
                              quality={100}
                              loading="lazy"
                              className="block w-10 h-10 bg-center bg-cover object-cover leading-10 rounded-full align-middle pointer-events-none"
                            />
                          </div>
                          <div>
                            <b>
                              <Link
                                prefetch={false}
                                href={`/person/${cast?.id}`}
                                className={`w-full text-sm font-normal pointer-events-none ${
                                  isNew && "text-green-500"
                                } ${isFocused ? "ring-blue-500" : ""} ${
                                  isChanged
                                    ? "text-blue-500"
                                    : "border-gray-300"
                                } ${
                                  markedForDeletion[i] &&
                                  "text-red-500 line-through"
                                }`}
                              >
                                {cast?.name}
                              </Link>
                            </b>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-left border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                      <div className="relative">
                        <div
                          className="relative cursor-pointer"
                          onClick={() => handleDropdownToggle("cast_role", i)}
                        >
                          <input
                            type="text"
                            name="cast_role"
                            readOnly
                            autoComplete="off"
                            className="w-full text-[#606266] dark:text-white placeholder:text-xs md:placeholder:text-sm placeholder:text-black  dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-1 md:py-2 px-3 mt-1 cursor-pointer"
                            placeholder={
                              castRoles[i]
                                ? castRoles[i]
                                : cast?.order < 2
                                ? "Main Role"
                                : "Support Role"
                            }
                          />
                          <IoIosArrowDown className="absolute bottom-2 md:bottom-3 right-2" />
                        </div>
                        {openDropdown === `cast_role-${i}` && (
                          <AnimatePresence>
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="w-[200px] md:w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                            >
                              {castRole?.map((items, index) => {
                                const isContentRating = cast?.cast_role
                                  ? cast?.cast_role === items?.value
                                  : role
                                  ? role === items?.value
                                  : roles === items?.value;

                                return (
                                  <li
                                    className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                      isContentRating
                                        ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                        : "text-black dark:text-white"
                                    }`}
                                    onClick={() => {
                                      handleDropdownToggle("cast_role", i);
                                      setCastRole(i, items?.value); // Update the story for this item
                                    }}
                                    key={index}
                                  >
                                    {items?.label}
                                  </li>
                                );
                              })}
                            </motion.ul>
                          </AnimatePresence>
                        )}
                      </div>
                    </td>
                    <td className="text-left border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                      <div className="relative">
                        <div className="relative">
                          <input
                            {...register(`cast.${i}.character`)}
                            type="text"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleCharacterChange(e, i)}
                            value={character[i] || cast?.character}
                            onFocus={() => handleFocus(i)}
                            onBlur={handleBlur}
                            placeholder={
                              cast?.character ||
                              cast?.roles?.map((role: any) => role?.character)
                            }
                            onDragStart={(e) => e.stopPropagation()}
                            className="w-full text-[#606266] dark:text-white text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm placeholder:text-black dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-text"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-right border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-4 py-3">
                      <div className="relative">
                        <div className="relative">
                          {markedForDeletion[i] ||
                          isItemChanging[i] ||
                          isChanged ? (
                            <button
                              id={`reset_one_${i}`}
                              name="Reset"
                              type="button"
                              className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3 mt-1"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                handleResetChanges(i);
                              }}
                            >
                              <GrPowerReset />
                            </button>
                          ) : (
                            <button
                              name="Close"
                              className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3 mt-1"
                              onClick={(e) => {
                                setOpen(!open), e.preventDefault();
                                setDeleteIndex(i); // Set the index of the item to show delete button
                              }}
                            >
                              <IoCloseOutline />
                            </button>
                          )}
                          {open && deleteIndex === i && (
                            <DeleteButton
                              setOpen={setOpen}
                              open={open}
                              handleRemoveItem={handleRemoveItem}
                              ind={i}
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
              })}
            </AnimatePresence>
          </Reorder.Group>
        </table>
      </div>
      <div className="text-left-p-4">
        <div className="float-right w-[50%]">
          <div className="block relative">
            <div className="relative w-full inline-block">
              <input
                className="w-full h-8 md:h-10 leading-10 placeholder:text-xs md:placeholder:text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                placeholder="Search to add a cast member"
                ref={inputRef}
                onChange={onInput}
              />
              <span className="absolute right-3 top-2 md:top-3">
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
                    className={`w-full h-[300px] absolute bg-white dark:bg-[#242526] border-[1px] border-[#f3f3f3f3] dark:border-[#3e4042] z-20 custom-scroll rounded-md shadow-lg mt-2 ${
                      openSearch === false ? "block" : "hidden"
                    }`}
                  >
                    {isFetching ? (
                      <div className="absolute top-[45%] left-[50%]">
                        <ClipLoader
                          color="#c0c4cc"
                          size={25}
                          loading={loading}
                        />
                      </div>
                    ) : (
                      <>
                        {searchPerson?.results?.map(
                          (person: any, idx: number) => {
                            const specificPerson = persons?.find(
                              (p) => p.id === person.id
                            );
                            return (
                              <div
                                className={`flex items-center hover:bg-[#00000011] dark:hover:bg-[#3a3b3c] cursor-pointer ${
                                  listSearch && "force-overflow"
                                }`}
                                key={idx}
                                onClick={() => onClickAddMovie(person.id)}
                              >
                                <LazyImage
                                  src={
                                    person?.profile_path === null
                                      ? "/placeholder-image.avif"
                                      : `https://image.tmdb.org/t/p/h632/${person?.profile_path}`
                                  }
                                  alt={`${person?.name}'s Poster`}
                                  width={40}
                                  height={40}
                                  quality={100}
                                  priority
                                  className="w-10 h-10 bg-cover bg-center object-cover mx-4 my-3 rounded-full"
                                />

                                <div className="flex flex-col items-start">
                                  <p className="text-[#2490da]">
                                    {person.name || person.title}
                                  </p>
                                  <small className="text-black dark:text-[#ffffff99]">
                                    {specificPerson?.place_of_birth !== null
                                      ? specificPerson?.place_of_birth
                                      : "NULL"}
                                  </small>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start">
        <button
          name="Submit"
          onClick={handleSubmit(onSubmit)}
          className={`text-xs md:text-base flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            movieIds?.length > 0 ||
            hasReordered ||
            castRoles?.some((role) => role !== undefined) ||
            character?.some((role) => role !== undefined) ||
            markedForDeletion?.includes(true) ||
            isItemChanging?.includes(true)
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            movieIds?.length > 0 ||
            hasReordered ||
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
        <button
          id="reset_all"
          type="button"
          className={`text-xs md:text-base flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-4 ${
            movieIds?.length > 0 ||
            hasReordered ||
            castRoles?.some((role) => role !== undefined) ||
            character?.some((role) => role !== undefined) ||
            markedForDeletion?.includes(true) ||
            isItemChanging?.includes(true)
              ? "cursor-pointer"
              : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
          }`}
          onClick={handleResetAll}
          disabled={
            movieIds?.length > 0 ||
            hasReordered ||
            castRoles?.some((role) => role !== undefined) ||
            character?.some((role) => role !== undefined) ||
            markedForDeletion?.includes(true) ||
            isItemChanging?.includes(true)
              ? false
              : true
          }
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

export default MovieCast;
