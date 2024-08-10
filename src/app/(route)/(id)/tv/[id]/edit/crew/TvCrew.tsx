"use client";

import {
  fetchAllCast,
  fetchPerson,
  fetchPersonSearch,
} from "@/app/actions/fetchMovieApi";
import DeleteButton from "@/app/component/ui/Button/DeleteButton";
import { crewRole } from "@/helper/item-list";
import { CrewType, Drama, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import Image from "next/image";
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

const TvCast: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: cast, isLoading } = useQuery({
    queryKey: ["tv_cast", tv_id],
    queryFn: () => fetchAllCast(tv_id),
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
  });

  const person_ids =
    searchPerson?.results?.map((person: any) => person?.id) || [];

  const { data: persons } = useQuery({
    queryKey: ["crew", person_ids],
    queryFn: () => fetchPersons(person_ids),
    enabled: person_ids.length > 0, // only run query if there are person IDs
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
    <form className="py-3 px-4">
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">Crew</h1>
      <div className="text-left">
        <table className="w-full max-w-full border-collapse bg-transparent mb-4">
          <thead>
            <tr>
              <th
                className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                colSpan={2}
              >
                Person
              </th>
              <th className="w-[235px] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Job
              </th>
              <th className="w-[112px] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
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
                  const isNew = personResult.includes(crew);
                  return (
                    <Reorder.Item
                      as="tr"
                      value={crew}
                      key={crew.id}
                      whileDrag={{
                        scale: 1.0,
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                        backgroundColor: "#c2e7b0",
                      }}
                      className="relative w-full"
                      style={{ display: "table-row" }}
                    >
                      <td className="w-3 border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
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
                      <td className="border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="flex items-start w-full">
                          <div className="flex-1">
                            <div className="float-left pr-4">
                              <Image
                                src={
                                  crew?.profile_path === null
                                    ? "/empty-pf.jpg"
                                    : `https://image.tmdb.org/t/p/original/${crew?.profile_path}`
                                }
                                alt={crew?.name}
                                width={500}
                                height={500}
                                quality={100}
                                className="block w-10 h-10 bg-center bg-cover object-cover leading-10 rounded-full align-middle pointer-events-none"
                              />
                            </div>
                            <div>
                              <b>
                                <Link
                                  href={`/person/${crew?.id}`}
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
                      <td className="text-left border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              name="job"
                              readOnly
                              autoComplete="off"
                              className="w-full text-[#606266] dark:text-white placeholder:text-[#00000099] dark:placeholder:text-white dark:placeholder:font-bold bg-white dark:bg-[#3a3b3c] detail_placeholder border-2 border-[#dcdfe6] dark:border-[#3a3b3c] hover:border-[#c0c4cc] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 py-2 px-3 mt-1 cursor-pointer"
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
                                className="w-full h-[250px] absolute bg-white dark:bg-[#242424] border-2 border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
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
                                    : job?.includes(items?.value) ||
                                      crew?.job === items.value;
                                  return (
                                    <li
                                      ref={(el) =>
                                        isContentRating &&
                                        scrollIntoViewIfNeeded(el)
                                      }
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
                      <td className="text-right border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top pl-4 py-3">
                        {markedForDeletion[ind] || isItemChanging[ind] ? (
                          <button
                            type="button"
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-2 border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent form submission
                              handleResetChanges(ind);
                            }}
                          >
                            <GrPowerReset />
                          </button>
                        ) : (
                          <button
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-2 border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
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
                            setStoredData={setStoredData}
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
                    className="text-center text-sm py-2 px-4 border-b-2 border-b-[#3e4042]"
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
                className="w-full h-10 leading-10 placeholder:text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-2 border-[#f3f3f3f3] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                placeholder="Search to add a cast member"
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
                    className={`w-full h-[300px] absolute bg-white dark:bg-[#242526] border-2 border-[#f3f3f3f3] dark:border-[#3e4042] z-20 custom-scroll rounded-md shadow-lg mt-2 ${
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
                                  <Image
                                    src={
                                      person?.profile_path === null
                                        ? "/empty-pf.jpg"
                                        : `https://image.tmdb.org/t/p/original/${person?.profile_path}`
                                    }
                                    alt={person?.name}
                                    width={50}
                                    height={50}
                                    quality={100}
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
      <button
        onClick={handleSubmit(onSubmit)}
        className={`flex items-center text-white bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          tvIds?.length > 0 ||
          isItemChanged ||
          crewRoles?.some((role) => role !== undefined) ||
          markedForDeletion?.includes(true) ||
          isItemChanging?.includes(true)
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={
          tvIds?.length > 0 ||
          isItemChanged ||
          crewRoles?.some((role) => role !== undefined) ||
          markedForDeletion?.includes(true) ||
          isItemChanging?.includes(true)
            ? false
            : true
        }
      >
        <span className="mr-1 pt-1">
          <ClipLoader color="#242526" loading={submitLoading} size={19} />
        </span>
        Submit
      </button>
    </form>
  );
};

export default TvCast;
