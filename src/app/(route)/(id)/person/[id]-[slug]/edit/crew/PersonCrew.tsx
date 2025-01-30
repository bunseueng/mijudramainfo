"use client";

import { fetchMultiSearch, fetchTv } from "@/app/actions/fetchMovieApi";
import { personCrewJob } from "@/helper/item-list";
import { CrewType } from "@/helper/type";
import { CreatePersonDetails, TCreatePersonDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrPowerReset } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { PersonEditList } from "../details/PersonEditList";
import dynamic from "next/dynamic";
import DramaRegion from "@/app/(route)/lists/[listId]/edit/DramaRegion";
import { Loader2 } from "lucide-react";
import { usePersonData } from "@/hooks/usePersonData";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { FaRegTrashAlt } from "react-icons/fa";

const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);

const PersonCrew: React.FC<PersonEditList> = ({ person_id, personDB }) => {
  const { person, isLoading } = usePersonData(person_id);
  const person_credits = useMemo(
    () => person?.combined_credits || [],
    [person?.combined_credits]
  );
  const tvid = person_credits?.crew?.map((item: any) => item?.id);
  const [storedData, setStoredData] = useState<CrewType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [crewRoles, setCrewRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [tvIds, setTvIds] = useState<number[]>(person_id ? [] : []);
  const [prevCrewRole, setPrevCrewRole] = useState<string[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(personDB?.crew?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(personDB?.crew?.length || 0).fill(false)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQueries = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchQueries?.get("query") || "";
  const router = useRouter();
  const { handleSubmit, reset } = useForm<TCreatePersonDetails>({
    resolver: zodResolver(CreatePersonDetails),
  });

  const {
    data: searchMulti,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchMulti"],
    queryFn: () => fetchMultiSearch(searchQuery),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const { data: tvAndMovieResult = [], refetch: refetchData } = useQuery({
    queryKey: ["tvAndMovieResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvIds.map(async (id: number) => await fetchTv(id.toString()))
      );
      return [...tvDetails];
    },
    enabled: true,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
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

  useEffect(() => {
    if (tvAndMovieResult.length > 0) {
      setStoredData(tvAndMovieResult);
    }
  }, [tvAndMovieResult]);

  const [item, setItem] = useState<CrewType[]>(() =>
    filterDuplicates([...(personDB?.crew || []), ...storedData])
  );

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  useEffect(() => {
    if (!isLoading && person_credits && person_credits.crew) {
      if (personDB?.crew?.length && personDB?.crew?.length > 0) {
        setItem(filterDuplicates([...(personDB?.crew || []), ...storedData]));
      } else {
        setItem(
          filterDuplicates([
            ...(personDB?.crew || []),
            ...person_credits.crew,
            ...storedData,
          ])
        );
      }
    }
  }, [isLoading, person_credits, storedData, personDB?.crew]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setCrewRole = (idx: number, role: string) => {
    setCrewRoles((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      return newRoles;
    });
    setPrevCrewRole((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      return newRoles;
    });
    // Update isItemChanging separately, only for the specific index
    setIsItemChanging((prev) => {
      const newState = [...prev];
      newState[idx] = true;
      return newState;
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
      const tvDetail = await fetchTv(parsedId.toString());
      setItem((prevItems: any) => [...prevItems, tvDetail]);
      setListSearch("");
    } catch (error) {
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
      setLoading(true);
      const { value } = e.target;
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

  const onSubmit = async () => {
    try {
      setSubmitLoading(true);
      const updatedItems = item
        ?.filter((_: any, idx: number) => !markedForDeletion[idx])
        ?.map((crew: any, index: number) => ({
          ...crew,
          job: crewRoles[index] || crew?.job,
        }));

      const res = await fetch(`/api/person/${person_id}/crew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId: person_id.toString(),
          crew: updatedItems,
        }),
      });

      if (res.status === 200) {
        router.refresh();
        reset();
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        toast.error("Bad Request");
      }
    } catch (error: any) {
      toast.error("Bad Request");
      throw new Error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const [originalItems, setOriginalItems] = useState([...item]); // Keep the original order
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [hasReordered, setHasReordered] = useState(false); // Track if order has been changed
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [reorderedItems, setReorderedItems] = useState<Set<string>>(new Set());

  const handleResetChanges = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        setResetLoading(true);

        // Clear reordered items first
        setReorderedItems(new Set());

        // Wait for animation frame to ensure state updates are processed
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            // Reset all states in a single batch
            setIsItemChanging(Array(originalItems.length).fill(false));
            setMarkedForDeletion(Array(originalItems.length).fill(false));
            setHasReordered(false);
            setIsDragging(false);
            setDraggedItemId(null);
            setItem([...originalItems]);
            setStoredData([]);
            setCrewRoles([]);
            resolve();
          });
        });
      } catch (error) {
        toast.error("Failed to reset changes");
      } finally {
        setResetLoading(false);
      }
    },
    [originalItems]
  );

  const handleIndividualReset = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      index: number
    ) => {
      e.preventDefault();
      try {
        setResetLoading(true);
        const currentItem = item[index];

        // Clear this item from reordered items first
        setReorderedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentItem.id.toString());
          return newSet;
        });

        // Find original index
        const originalIndex = originalItems.findIndex(
          (origItem) => origItem.id === currentItem.id
        );

        if (originalIndex !== -1) {
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              // Create new array with current state
              const newItems = [...item];
              // Remove current item
              newItems.splice(index, 1);
              // Insert at original position
              newItems.splice(originalIndex, 0, {
                ...originalItems[originalIndex],
                jobs: originalItems[originalIndex].jobs,
              });

              // Update states
              setItem(newItems);
              setIsItemChanging((prev) => {
                const newChanging = [...prev];
                newChanging[index] = false;
                return newChanging;
              });
              setMarkedForDeletion((prev) => {
                const newDeletion = [...prev];
                newDeletion[index] = false;
                return newDeletion;
              });
              setCrewRoles((prev) => {
                const newRoles = [...prev];
                newRoles[index] = "";
                return newRoles;
              });
              // Update hasReordered state based on remaining reordered items
              setHasReordered((prev) => {
                // Only keep hasReordered true if there are other reordered items
                const remainingReorderedItems = new Set([...reorderedItems]);
                remainingReorderedItems.delete(currentItem.id.toString());
                return remainingReorderedItems.size > 0;
              });
              resolve();
            });
          });
        }
      } catch (error) {
        toast.error("Failed to reset item");
      } finally {
        setResetLoading(false);
      }
    },
    [item, originalItems, reorderedItems]
  );

  const hasChanges = useMemo(() => {
    if (resetLoading) return false;

    return (
      tvIds.length > 0 ||
      hasReordered ||
      markedForDeletion.some((marked) => marked) ||
      isItemChanging.some((changing) => changing) ||
      reorderedItems.size > 0
    );
  }, [
    resetLoading,
    tvIds.length,
    hasReordered,
    markedForDeletion,
    isItemChanging,
    reorderedItems,
  ]);

  useEffect(() => {
    // Only update originalItems when item changes and we're not in the middle of reordering
    if (!hasReordered && item.length > 0) {
      setOriginalItems([...item]);
    }
  }, [item, hasReordered]); // Keep both dependencies

  // Add this effect to handle cleanup
  useEffect(() => {
    const cleanup = () => {
      // Only cleanup if the component is still mounted
      setReorderedItems(new Set());
      setResetLoading(false);
      setIsDragging(false);
      setDraggedItemId(null);
    };
    return cleanup;
  }, []); // Empty dependency array since this is cleanup
  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <form className="py-3 px-4">
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">Crew</h1>
      <div className="text-left">
        <table className="w-full max-w-full border-collapse bg-transparent mb-4">
          <thead>
            <tr>
              <th
                className="border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                colSpan={2}
              >
                Person
              </th>
              <th className="w-[235px] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-[1px] border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Job
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
                item?.map((crew: any, ind: number) => {
                  const role = crewRoles[ind];
                  const job = crew?.jobs?.map((rol: any) => rol?.job);
                  const isNew = tvAndMovieResult.includes(crew);
                  return (
                    <Reorder.Item
                      as="tr"
                      value={crew}
                      key={crew.id}
                      initial={false}
                      animate={{
                        backgroundColor:
                          reorderedItems.has(crew.id.toString()) &&
                          !resetLoading
                            ? "hsl(var(--primary))"
                            : "transparent",
                        color:
                          reorderedItems.has(crew.id.toString()) &&
                          !resetLoading
                            ? "hsl(var(--primary-foreground))"
                            : "inherit",
                        transition: { duration: 0.2 },
                        zIndex:
                          isDragging && draggedItemId === crew.id.toString()
                            ? 9999
                            : openDropdown === `job-${ind}`
                            ? 9998
                            : 1,
                      }}
                      className="relative border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      dragListener={
                        !isItemChanging[ind] && !markedForDeletion[ind]
                      }
                      dragConstraints={{ top: 0, bottom: 0 }}
                      onDragStart={() => {
                        setIsDragging(true);
                        setDraggedItemId(crew.id.toString());
                      }}
                      onDragEnd={() => {
                        setIsDragging(false);
                        setDraggedItemId(null);
                        setHasReordered(true);
                        setReorderedItems((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(crew.id.toString());
                          return newSet;
                        });
                      }}
                    >
                      <td className="w-3 border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
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
                      <td className="border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="flex items-start w-full">
                          <div className="flex-1">
                            <div className="float-left pr-4">
                              <Image
                                src={
                                  crew?.poster_path ||
                                  crew?.backdrop_path === null
                                    ? `https://image.tmdb.org/t/p/original/${
                                        crew?.poster_path || crew?.backdrop_path
                                      }`
                                    : "/empty-pf.jpg"
                                }
                                alt={crew?.name}
                                width={500}
                                height={500}
                                quality={100}
                                loading="lazy"
                                className="block w-10 h-10 bg-center bg-cover object-cover leading-10 rounded-full align-middle pointer-events-none"
                              />
                            </div>
                            <div>
                              <b>
                                <Link
                                  href={`/person/${crew?.id}-${spaceToHyphen(
                                    crew?.name
                                  )}`}
                                  className={`w-full text-sm font-normal pointer-events-none ${
                                    isNew && "text-green-500"
                                  } ${isItemChanging[ind] && "text-blue-500"} ${
                                    markedForDeletion[ind] &&
                                    "text-red-500 line-through"
                                  }`}
                                >
                                  {crew?.name}
                                </Link>
                              </b>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-left border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div
                          className={`relative ${
                            openDropdown === `job-${ind}`
                              ? "z-[10000]"
                              : "z-auto"
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="text"
                              name="job"
                              readOnly
                              autoComplete="off"
                              className="w-full text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                              placeholder={
                                crew?.job?.length > 0
                                  ? crewRoles[ind] || crew?.job
                                  : crewRoles[ind] || job
                              }
                              onClick={() => handleDropdownToggle("job", ind)}
                            />
                            <IoIosArrowDown className="absolute bottom-3 right-2" />
                          </div>
                          {openDropdown === `job-${ind}` && (
                            <AnimatePresence>
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-[10001] custom-scroll"
                              >
                                {personCrewJob?.map((items, index) => {
                                  const scrollIntoViewIfNeeded = (
                                    element: any
                                  ) => {
                                    const rect =
                                      element?.getBoundingClientRect();
                                    const isVisible =
                                      rect?.top >= 0 &&
                                      rect?.left >= 0 &&
                                      rect?.bottom <=
                                        (window?.innerHeight ||
                                          document?.documentElement
                                            ?.clientHeight) &&
                                      rect?.right <=
                                        (window?.innerWidth ||
                                          document?.documentElement
                                            .clientWidth);

                                    if (!isVisible) {
                                      element?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "nearest",
                                        inline: "nearest",
                                      });
                                    }
                                  };
                                  const isContentRating = role
                                    ? role === items?.value
                                    : job?.includes(items?.value) ||
                                      crew?.job === items.value;
                                  return (
                                    <li
                                      ref={(el) => {
                                        isContentRating &&
                                          scrollIntoViewIfNeeded(el);
                                      }}
                                      className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                        isContentRating
                                          ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                                          : "text-black dark:text-white"
                                      }`}
                                      onClick={() => {
                                        handleDropdownToggle("job", ind);
                                        setCrewRole(ind, items?.value); // Update the story for this item
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
                      <td className="text-right border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-4 py-3">
                        {(markedForDeletion[ind] ||
                          isItemChanging[ind] ||
                          reorderedItems.has(crew.id.toString())) &&
                        !resetLoading ? (
                          <button
                            type="button"
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                            onClick={(e) => handleIndividualReset(e, ind)}
                          >
                            <GrPowerReset />
                          </button>
                        ) : (
                          <button
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
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
                            item={item}
                            storedData={storedData}
                            setStoredData={setStoredData as any}
                            setOpen={setOpen}
                            open={open}
                            handleRemoveItem={handleRemoveItem}
                            markedForDeletion={markedForDeletion}
                            setMarkedForDeletion={setMarkedForDeletion}
                            ind={ind}
                            setDeleteIndex={setDeleteIndex}
                          />
                        )}
                      </td>
                    </Reorder.Item>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="text-center text-sm py-2 px-4 border-b-[1px] border-b-[#3e4042]"
                    colSpan={3}
                  >
                    No items found
                  </td>
                </tr>
              )}
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
      <div className="flex items-start">
        <button
          name="Submit"
          onClick={handleSubmit(onSubmit)}
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            hasChanges
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={!hasChanges}
        >
          {submitLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </button>
        <button
          type="button"
          className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-4 ${
            hasChanges
              ? "cursor-pointer"
              : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
          }`}
          onClick={(e) => handleResetChanges(e)}
          disabled={!hasChanges}
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

export default PersonCrew;
