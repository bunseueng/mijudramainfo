"use client";

import { fetchPerson, fetchPersonSearch } from "@/app/actions/fetchMovieApi";
import LazyImage from "@/components/ui/lazyimage";
import { crewRole } from "@/helper/item-list";
import { CrewType, Movie, movieId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { useMovieData } from "@/hooks/useMovieData";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
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
import { FaRegTrashAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrPowerReset } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);

const MovieCrew: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const { movie, isLoading } = useMovieData(movie_id);
  const cast = useMemo(() => movie?.credits || [], [movie?.credits]);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [crewRoles, setCrewRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [movieIds, setMovieIds] = useState<number[]>(movie_id ? [] : []);
  const [prevCrewRole, setPrevCrewRole] = useState<string[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(movieDetails?.crew?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(movieDetails?.crew?.length || 0).fill(false)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQueries = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchQueries?.get("query") || "";
  const router = useRouter();
  const { handleSubmit, reset } = useForm<TCreateDetails>({
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
    queryKey: ["crew", person_ids],
    queryFn: () => fetchPersons(person_ids),
    enabled: person_ids.length > 0, // only run query if there are person IDs
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: personResult = [], refetch: refetchData } = useQuery({
    queryKey: ["crewResult"],
    queryFn: async () => {
      const personDetails = await Promise.all(
        movieIds.map(async (id: number) => await fetchPerson(id.toString()))
      );
      return [...personDetails];
    },
    enabled: true,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const getUniqueKey = (crew: any, index: number) => {
    return crew.credit_id || `crew-${crew.id}-${index}`;
  };

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
  const [storedData, setStoredData] = useState<CrewType[]>([]);

  useEffect(() => {
    if (personResult.length > 0) {
      setStoredData(personResult);
    }
  }, [personResult]);

  const deepCopyArray = (arr: any[]) => arr.map((item) => ({ ...item })); // Create deep copy

  const [item, setItem] = useState(() =>
    [...(movieDetails?.crew || []), ...storedData].length > 0
      ? deepCopyArray([...(movieDetails?.crew || []), ...storedData])
      : deepCopyArray(cast?.crew || [])
  );
  const [originalItems, setOriginalItems] = useState([...item]); // Keep the original order
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [hasReordered, setHasReordered] = useState(false); // Track if order has been changed
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [reorderedItems, setReorderedItems] = useState<Set<string>>(new Set());
  const [originalPositions, setOriginalPositions] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (!isLoading && cast && cast.crew) {
      if (movieDetails?.crew?.length && movieDetails?.crew?.length > 0) {
        setItem(
          filterDuplicates([...(movieDetails?.crew || []), ...storedData])
        );
      } else {
        setItem(
          filterDuplicates([
            ...(movieDetails?.crew || []),
            ...cast.crew,
            ...storedData,
          ])
        );
      }
    }
  }, [isLoading, cast, storedData, movieDetails?.crew]);

  useEffect(() => {
    refetchData();
  }, [movieIds, refetchData]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setCrewRole = (idx: number, role: string) => {
    setPrevCrewRole((prev) => {
      const newRoles = [...crewRoles];
      newRoles[idx] = role;
      return [...prev];
    });
    setCrewRoles((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      setIsItemChanging(newRoles as any);
      return newRoles;
    }); // Update isItemChanging separately, only for the specific index
    setIsItemChanging((prev) => {
      const newState = [...prev];
      newState[idx] = true;
      return newState;
    });
  };

  const onClickAddMovie = async (id: string) => {
    const parsedId = parseInt(id, 10);
    setMovieIds((prevmovieIds) => [...prevmovieIds, parsedId]);
    setListSearch(""); // Clear the search input
    try {
      const personDetail = await fetchPerson(parsedId.toString());
      setItem((prevItems: any) => [...prevItems, personDetail]);
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

      const res = await fetch(`/api/movie/${movie_id}/crew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie_id.toString(),
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
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReorder = useCallback(
    (newOrder: any) => {
      setItem(newOrder);
      setHasReordered(true);

      if (draggedItemId) {
        const originalIndex = originalPositions[draggedItemId];
        const newIndex = newOrder.findIndex(
          (item: any) => item.id.toString() === draggedItemId
        );

        if (originalIndex !== newIndex) {
          setReorderedItems((prev) => new Set([...prev, draggedItemId]));
        }
      }
    },
    [draggedItemId, originalPositions]
  );

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
            setMovieIds([]);
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
                job: originalItems[originalIndex].job,
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
      movieIds.length > 0 ||
      hasReordered ||
      markedForDeletion.some((marked) => marked) ||
      isItemChanging.some((changing) => changing) ||
      reorderedItems.size > 0
    );
  }, [
    resetLoading,
    movieIds.length,
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
            onReorder={handleReorder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {item?.length > 0 ? (
                item?.map((crew: any, ind: number) => {
                  const role = crewRoles[ind];
                  const isNew = personResult.includes(crew);
                  return (
                    <Reorder.Item
                      as="tr"
                      value={crew}
                      key={getUniqueKey(crew, ind)}
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
                      <td className="w-3 border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-4 py-3">
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
                      <td className="border-[#78828c0b] border-t-[1px] border-t-[#06090c21] dark:border-t-[#3e4042] align-top pr-4 py-3">
                        <div className="flex items-start w-full">
                          <div className="flex-1">
                            <div className="float-left pr-2">
                              <Image
                                src={
                                  crew?.profile_path === null
                                    ? "/default-pf.jpg"
                                    : `https://image.tmdb.org/t/p/h632/${crew?.profile_path}`
                                }
                                alt={
                                  `${crew?.name}'s Profile` || "Crew Profile"
                                }
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
                          <div
                            className="relative cursor-pointer"
                            onClick={() => handleDropdownToggle("job", ind)}
                          >
                            <input
                              type="text"
                              name="job"
                              readOnly
                              autoComplete="off"
                              className="w-full text-xs md:text-sm text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
                              placeholder={
                                crewRoles[ind] ? crewRoles[ind] : crew?.job
                              }
                            />
                            <IoIosArrowDown className="absolute bottom-2 md:bottom-3 right-2" />
                          </div>
                          {openDropdown === `job-${ind}` && (
                            <AnimatePresence>
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-[200px] md:w-[250px] h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-[10001] custom-scroll"
                              >
                                {crewRole?.map((items, index) => {
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
                                    : crew?.job?.includes(items?.value) ||
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
                            name="Reset"
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
                              setOpen(!open);
                              e.preventDefault();
                              setDeleteIndex(ind);
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
                <tr className="w-full">
                  <td
                    className="w-full text-center text-sm py-2 px-4 border-b-[1px] border-b-[#3e4042]"
                    colSpan={3}
                  >
                    No items found
                  </td>
                  <td
                    className="w-full text-center text-sm py-2 px-4 border-b-[1px] border-b-[#3e4042]"
                    colSpan={3}
                  ></td>
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
                className="w-full h-8 md:h-10 leading-10 placeholder:text-xs md:placeholder:text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                placeholder="Search to add a crew member"
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
                        {searchPerson?.results?.length > 0 ? (
                          searchPerson?.results?.map(
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
                                    alt={`${person?.name}'s Profile`}
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
                                      {`${
                                        specificPerson?.place_of_birth === null
                                          ? "NULL"
                                          : specificPerson?.place_of_birth
                                      } / ${
                                        specificPerson?.known_for_department
                                      }`}
                                    </small>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="text-center mt-20">
                            Search result is not found!
                          </div>
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

export default MovieCrew;
