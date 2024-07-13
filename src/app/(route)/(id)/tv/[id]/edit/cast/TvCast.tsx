"use client";

import {
  fetchAllCast,
  fetchPerson,
  fetchPersonSearch,
} from "@/app/actions/fetchMovieApi";
import DeleteButton from "@/app/component/ui/Button/DeleteButton";
import { castRole } from "@/helper/item-list";
import { Drama, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
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

const determineRole = (cast: any) => {
  if (cast?.roles?.some((role: any) => role?.episode_count < 6)) {
    return "Guest Role";
  }
  if (cast.order < 2) {
    return "Main Role";
  }
  return "Support Role";
};

const TvCast: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: cast, isLoading } = useQuery({
    queryKey: ["tv_cast", tv_id],
    queryFn: () => fetchAllCast(tv_id),
  });
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [castRoles, setCastRoles] = useState<string[]>([]);
  const [listSearch, setListSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [character, setCharacter] = useState<string>("");
  const [tvIds, setTvIds] = useState<number[]>(tv_id ? [] : []);
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
    queryKey: ["searchPerson"],
    queryFn: () => fetchPersonSearch(searchQuery),
  });

  const person_ids =
    searchPerson?.results?.map((person: any) => person?.id) || [];

  const { data: persons } = useQuery({
    queryKey: ["persons", person_ids],
    queryFn: () => fetchPersons(person_ids),
    enabled: person_ids.length > 0, // only run query if there are person IDs
  });
  const { data: personResult = [], refetch: refetchData } = useQuery({
    queryKey: ["personResult"],
    queryFn: async () => {
      const personDetails = await Promise.all(
        tvIds.map(async (id: number) => await fetchPerson(id))
      );
      return [...personDetails];
    },
    enabled: true,
  });

  const [item, setItem] = useState(() =>
    [...(tvDetails?.cast || []), ...personResult].length > 0
      ? [...(tvDetails?.cast || []), ...personResult]
      : cast?.cast || []
  );
  const prevItemRef = useRef(item);

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const setCastRole = (idx: number, role: string) => {
    setCastRoles((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
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
    if (!data.cast) {
      toast.error("No cast data provided");
      return;
    }

    try {
      const updatedItems = item.map((cast: any, index: number) => ({
        ...cast,
        cast_role: castRoles[index],
        character: data.cast![index].character, // using non-null assertion after the check
      }));

      const res = await fetch(`/api/tv/${tv_id}/cast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tv_id: tv_id.toString(), cast: updatedItems }),
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
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">Cast</h1>
      <div className="text-left">
        <table className="w-full max-w-full border-collapse bg-transparent mb-4">
          <thead>
            <tr>
              <th className="w-[235px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Person
              </th>
              <th className="w-[235px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Role
              </th>
              <th className="w-[235px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Character
              </th>
              <th className="w-[112px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
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
              {item?.map((cast: any, ind: number) => {
                const roles = determineRole(cast);
                const role = castRoles[ind];
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
                    <td className="w-3 border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                      <div className="flex items-start w-full">
                        <span className="pr-2">
                          <GiHamburgerMenu />
                        </span>
                        <div className="flex-1">
                          <div className="float-left pr-4">
                            <Image
                              src={
                                cast?.profile_path === null
                                  ? "/empty-pf.jpg"
                                  : `https://image.tmdb.org/t/p/original/${cast?.profile_path}`
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
                                href={`/person/${cast?.id}`}
                                className="w-full text-sm font-normal pointer-events-none"
                              >
                                {cast?.name}
                              </Link>
                            </b>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-left border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            name="cast_role"
                            readOnly
                            autoComplete="off"
                            className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
                            placeholder={
                              cast?.cast_role?.length > 0
                                ? castRoles[ind] || cast?.cast_role
                                : castRoles[ind] ||
                                  cast?.roles?.map((rol: any) =>
                                    rol?.episode_count < 6
                                      ? "Guest Role"
                                      : cast?.order < 2
                                      ? "Main Role"
                                      : "Support Role"
                                  )
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
                              className={`w-full h-[250px] absolute bg-[#242424] border-2 border-[#242424] py-1 mt-2 rounded-md z-10  custom-scroll`}
                            >
                              {castRole?.map((items, index) => {
                                const isContentRating = role
                                  ? role === items?.value
                                  : roles === items?.value;
                                return (
                                  <li
                                    className={`hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                      isContentRating
                                        ? "text-[#409eff] bg-[#2a2b2c]"
                                        : ""
                                    } `}
                                    onClick={() => {
                                      handleDropdownToggle("cast_role", ind);
                                      setCastRole(ind, items?.value); // Update the story for this item
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
                    <td className="text-left border-[#78828c0b] border-t-2 border-t-[#3e4042] align-bottom px-4 p-3">
                      <input
                        {...register(`cast.${ind}.character`)}
                        type="text"
                        onChange={(e) => setCharacter(e.target.value)}
                        defaultValue={
                          cast?.character ||
                          cast?.roles?.map((role: any) => role?.character)
                        }
                        className="w-full h-[44px] leading-10 bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                      />
                    </td>
                    <td className="text-right border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top pl-4 py-3">
                      <button
                        className="min-w-10 bg-[#3a3b3c] text-[#ffffffde] border-2 border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                        onClick={(e) => {
                          setOpen(!open), e.preventDefault();
                          setDeleteIndex(ind); // Set the index of the item to show delete button
                        }}
                      >
                        <IoCloseOutline />
                      </button>
                      {deleteIndex === ind && (
                        <DeleteButton
                          setOpen={setOpen}
                          open={open}
                          handleRemoveItem={handleRemoveItem}
                          ind={ind}
                          setDeleteIndex={setDeleteIndex}
                        />
                      )}
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
                type="text"
                className="w-full h-10 leading-10 bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
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
                    className={`w-full h-[300px] absolute bg-[#242526] border-2 border-[#3e4042] z-20 custom-scroll rounded-md shadow-lg mt-2 ${
                      openSearch === false ? "block" : "hidden"
                    }`}
                  >
                    {isFetching ? (
                      <div className="absolute top-[45%] left-[50%]">
                        <ClipLoader color="#fff" size={25} loading={loading} />
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
                                className={`flex items-center hover:bg-[#3a3b3c] cursor-pointer ${
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
                                  <small className="text-[#ffffff99]">
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
      <button
        onClick={handleSubmit(onSubmit)}
        className={`flex items-center bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          tvIds?.length > 0 ||
          castRoles?.length > 0 ||
          character?.length > 0 ||
          isItemChanged
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={
          tvIds?.length > 0 ||
          castRoles?.length > 0 ||
          character?.length > 0 ||
          isItemChanged
            ? false
            : true
        }
      >
        Submit
      </button>
    </form>
  );
};

export default TvCast;
