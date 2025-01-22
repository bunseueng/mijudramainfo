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
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrPowerReset } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [openSearch, setOpenSearch] = useState<boolean>(false);
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
        tvIds.map(async (id: number) => await fetchPerson(id))
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
    setCrewRoles((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      setIsItemChanging(newRoles as any);
      return newRoles;
    });
    setPrevCrewRole((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      setIsItemChanging(newRoles as any);
      return newRoles;
    });
  };

  const handleResetChanges = (ind: number) => {
    setIsItemChanging((prevIsItemChanging) => {
      const newIsItemChanging = [...prevIsItemChanging];
      newIsItemChanging[ind] = false;
      return newIsItemChanging;
    });
    setCrewRoles((prevCrewRoles) => {
      const newRole = [...prevCrewRoles];
      newRole[ind] = prevCrewRole[ind];
      return newRole;
    });
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === ind ? false : marked))
    );
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

  const onSubmit = async (data: TCreateDetails) => {
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
    if (prevItemRef.current !== item) {
    }
    prevItemRef.current = item; // Update the ref with the current item
  }, [item]);

  const isItemChanged = prevItemRef.current !== item;

  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <Card className="w-full !bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Crew</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Reorder.Group
            as="ul"
            axis="y"
            values={item}
            onReorder={setItem}
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
                      whileDrag={{
                        scale: 1.02,
                        boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                      }}
                      className="p-4 flex items-center justify-between w-full"
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
                          href={`/person/${crew?.id}`}
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
                        <div className="relative">
                          <Button
                            variant="outline"
                            className="w-40 justify-between"
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
                              className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-auto max-h-60"
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
                        {markedForDeletion[ind] || isItemChanging[ind] ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleResetChanges(ind);
                            }}
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
            <Button
              type="submit"
              disabled={
                !(
                  tvIds?.length > 0 ||
                  isItemChanged ||
                  crewRoles?.some((role) => role !== undefined) ||
                  markedForDeletion?.includes(true) ||
                  isItemChanging?.includes(true)
                )
              }
            >
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Submit
            </Button>

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
