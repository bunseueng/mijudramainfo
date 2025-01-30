"use client";

import {
  fetchAllCast,
  fetchPerson,
  fetchPersonSearch,
} from "@/app/actions/fetchMovieApi";
import LazyImage from "@/components/ui/lazyimage";
import { crewRole } from "@/helper/item-list";
import { CrewType, Drama, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { ChevronDown, Loader2, Menu, RotateCcw, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
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
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { FaRegTrashAlt } from "react-icons/fa";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);

const TvCast: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: cast, isLoading } = useQuery({
    queryKey: ["tv_cast", tv_id],
    queryFn: () => fetchAllCast(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [crewRoles, setCrewRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [tvIds, setTvIds] = useState<number[]>(tv_id ? [] : []);
  const [prevCrewRole, setPrevCrewRole] = useState<string[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.crew?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(tvDetails?.crew?.length || 0).fill(false)
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
        tvIds.map(async (id: number) => await fetchPerson(id.toString()))
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

  const [storedData, setStoredData] = useState<CrewType[]>([]);

  useEffect(() => {
    if (personResult.length > 0) {
      setStoredData(personResult);
    }
  }, [personResult]);

  const [item, setItem] = useState<CrewType[]>(() =>
    filterDuplicates([...(tvDetails?.crew || []), ...storedData])
  );

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  useEffect(() => {
    if (!isLoading && cast && cast.crew) {
      if (tvDetails?.crew?.length && tvDetails?.crew?.length > 0) {
        setItem(filterDuplicates([...(tvDetails?.crew || []), ...storedData]));
      } else {
        setItem(
          filterDuplicates([
            ...(tvDetails?.crew || []),
            ...cast.crew,
            ...storedData,
          ])
        );
      }
    }
  }, [isLoading, cast, storedData, tvDetails?.crew]);
  const prevItemRef = useRef(item);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setCrewRole = (idx: number, role: string) => {
    setPrevCrewRole((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      return newRoles;
    });

    setCrewRoles((prev) => {
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

  const onClickAddMovie = async (id: string) => {
    const parsedId = parseInt(id, 10);
    setTvIds((prevTvIds) => [...prevTvIds, parsedId]);
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

      const res = await fetch(`/api/tv/${tv_id}/crew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tv_id: tv_id.toString(), crew: updatedItems }),
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
  const [originalPositions, setOriginalPositions] = useState<{
    [key: string]: number;
  }>({});

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
            setTvIds([]);
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

    const hasReorderedItems = reorderedItems.size > 0;
    const hasRoleChanges = crewRoles.some((role) => role && role.length > 0);
    const hasMarkedItems = markedForDeletion.some((marked) => marked);
    const hasChangingItems = isItemChanging.some((changing) => changing);
    const hasNewItems = tvIds.length > 0;

    return (
      hasReorderedItems ||
      hasRoleChanges ||
      hasMarkedItems ||
      hasChangingItems ||
      hasNewItems ||
      hasReordered
    );
  }, [
    resetLoading,
    reorderedItems,
    crewRoles,
    markedForDeletion,
    isItemChanging,
    tvIds.length,
    hasReordered,
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
    return <SearchLoading />;
  }

  return (
    <Card className="w-full !bg-transparent !border-0">
      <CardHeader className="!p-0 !px-4 !pb-4">
        <CardTitle className="text-2xl font-bold text-primary">Crew</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Reorder.Group
            as="ul"
            axis="y"
            values={item}
            onReorder={handleReorder}
            className="space-y-2"
          >
            <AnimatePresence>
              {item?.length > 0 ? (
                item?.map((crew: any, ind: number) => {
                  const role = crewRoles[ind];
                  const job = crew?.jobs?.map((rol: any) => rol?.job);
                  const isNew = personResult.includes(crew);

                  return (
                    <Reorder.Item
                      key={crew.id}
                      value={crew}
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
                      className="relative flex items-center justify-between border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted p-4"
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
                      <div className="flex items-center space-x-4 flex-grow">
                        <Menu
                          className={`${isNew ? "text-green-500" : ""} ${
                            isItemChanging[ind] ? "text-blue-500" : ""
                          }`}
                        />
                        <LazyImage
                          src={
                            crew?.profile_path
                              ? `https://image.tmdb.org/t/p/h632/${crew?.profile_path}`
                              : "/placeholder-image.avif"
                          }
                          alt={`${crew?.name}'s Profile`}
                          width={40}
                          height={40}
                          className="size-10 object-cover rounded-full"
                        />
                        <Link
                          prefetch={false}
                          href={`/person/${crew?.id}-${spaceToHyphen(
                            crew?.name
                          )}`}
                          className={`font-medium ${
                            isNew ? "text-green-500" : ""
                          } ${isItemChanging[ind] ? "text-blue-500" : ""} ${
                            markedForDeletion[ind]
                              ? "text-red-500 line-through"
                              : ""
                          }`}
                        >
                          {crew?.name}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`relative ${
                            openDropdown === `cast_role-${ind}`
                              ? "z-[10000]"
                              : "z-auto"
                          }`}
                        >
                          <Button
                            variant="outline"
                            className={`w-auto md:w-56 justify-between !bg-transparent  ${
                              reorderedItems.has(crew.id.toString()) &&
                              !resetLoading
                                ? "hover:text-black"
                                : "hover:text-white"
                            }`}
                            type="button"
                            onClick={() => handleDropdownToggle("job", ind)}
                          >
                            {crewRoles[ind] || crew?.job || job || "Select Job"}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                          {openDropdown === `job-${ind}` && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-[10001] w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-auto max-h-60"
                            >
                              {crewRole?.map((item, index) => (
                                <li
                                  key={index}
                                  className={`px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                                    (
                                      role
                                        ? role === item?.value
                                        : job?.includes(item?.value) ||
                                          crew?.job === item.value
                                    )
                                      ? "bg-accent text-accent-foreground"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleDropdownToggle("job", ind);
                                    setCrewRole(ind, item?.value);
                                  }}
                                >
                                  {item?.label}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </div>
                        {markedForDeletion[ind] ||
                        isItemChanging[ind] ||
                        (reorderedItems.has(crew.id.toString()) &&
                          !resetLoading) ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={(e) => handleIndividualReset(e, ind)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              setOpen(!open);
                              e.preventDefault();
                              setDeleteIndex(ind);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
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
                      </div>
                    </Reorder.Item>
                  );
                })
              ) : (
                <li className="text-center py-4">No items found</li>
              )}
            </AnimatePresence>
          </Reorder.Group>

          <div className="flex justify-between items-center">
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

            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search to add a cast member"
                ref={inputRef}
                onChange={onInput}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              {listSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={searchResultRef}
                  className="absolute w-full bg-popover border rounded-md shadow-lg mt-2 z-50 max-h-60 overflow-auto"
                >
                  {isFetching ? (
                    <div className="flex justify-center items-center h-20">
                      <ClipLoader color="#c0c4cc" size={25} loading={loading} />
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
                                key={idx}
                                className="flex items-center p-2 hover:bg-accent cursor-pointer"
                                onClick={() => onClickAddMovie(person.id)}
                              >
                                <LazyImage
                                  src={
                                    person?.profile_path
                                      ? `https://image.tmdb.org/t/p/h632/${person?.profile_path}`
                                      : "/placeholder-image.avif"
                                  }
                                  alt={`${person?.name}'s Profile`}
                                  width={40}
                                  height={40}
                                  className="rounded-full mr-3"
                                />
                                <div>
                                  <p className="font-medium">
                                    {person.name || person.title}
                                  </p>
                                  <small className="text-muted-foreground">
                                    {`${
                                      specificPerson?.place_of_birth ||
                                      "Unknown"
                                    } / ${
                                      specificPerson?.known_for_department ||
                                      "Unknown"
                                    }`}
                                  </small>
                                </div>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-center p-4">No results found</div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TvCast;
