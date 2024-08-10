"use client";

import DramaRegion from "@/app/(route)/lists/[listId]/edit/DramaRegion";
import { fetchMultiSearch, fetchTv } from "@/app/actions/fetchMovieApi";
import DeleteButton from "@/app/component/ui/Button/DeleteButton";
import { storyFormat } from "@/helper/item-list";
import { Drama, tvId } from "@/helper/type";
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

const RelatedTitle: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [listSearch, setListSearch] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [tvIds, setTvIds] = useState<number[]>(tv_id ? [] : []);
  const [prevStories, setPrevStories] = useState<string[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.related_title?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(tvDetails?.related_title?.length || 0).fill(false)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQuery = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = searchQuery?.get("query") || "";
  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const {
    data: tvAndMovieResult = [],
    refetch: refetchData,
    isLoading,
  } = useQuery({
    queryKey: ["tvAndMovieResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvIds.map(async (id: number) => await fetchTv(id))
      );
      return [...tvDetails];
    },
    enabled: true,
  });

  const [storedData, setStoredData] = useState<any[]>([]);
  const [item, setItem] = useState<any[]>([]);
  const [itemStories, setItemStories] = useState<string[]>([]);
  const [itemRelatedStories, setItemRelatedStories] = useState<string[]>([]);
  const prevItemRef = useRef(item);

  useEffect(() => {
    if (tvAndMovieResult.length > 0) {
      setItemStories(Array(tvAndMovieResult.length).fill(""));
    }
  }, [tvAndMovieResult]);

  const setItemRelatedStory = (idx: number, story: string) => {
    setItemRelatedStories((prev) => {
      const newStories = [...prev];
      newStories[idx] = story;
      return newStories;
    });
    setPrevStories((prev) => {
      const newStories = [...prev];
      newStories[idx] = story;
      return newStories;
    });
    setIsItemChanging((prev) => {
      const newStories = [...prev];
      newStories[idx] = story as any;
      return newStories;
    });
  };

  useEffect(() => {
    const addingItems = storedData?.map((data) => ({
      ...data,
      story: itemRelatedStories,
    }));

    const newItems = [...addingItems, ...(tvDetails?.related_title || [])];

    setItem(newItems);
  }, [tvDetails?.related_title, storedData, itemRelatedStories]);

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
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

  const {
    data: multiSearch,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["multiSearch"],
    queryFn: () => fetchMultiSearch(query),
  });

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

  const onClickAddMovie = async (id: string, mediaType: string) => {
    const parsedId = parseInt(id, 10);
    if (mediaType === "tv" && !tvIds.includes(parsedId)) {
      setTvIds((prevTvIds) => [...prevTvIds, parsedId]);
      setListSearch(""); // Clear the search input
    }
    try {
      const tvDetail = await fetchTv(parsedId);
      setItem((prevItems) => [...prevItems, tvDetail]);
      setStoredData((prevData) => [...prevData, tvDetail]);
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
    setItem((prevItems) => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (data: TCreateDetails) => {
    try {
      // Create a map of updated stories by matching indices
      const updatedStoriesMap = itemRelatedStories.reduce(
        (map: any, story, index) => {
          if (story) {
            map[item[index].id] = story; // assuming each item has a unique id
          }
          return map;
        },
        {}
      );
      // Update the story in existing related titles
      const existingRelatedTitles = (tvDetails?.related_title || []).map(
        (drama: any) => ({
          ...drama,
          story: updatedStoriesMap[drama.id] || drama.story, // Update story if it exists in the map
        })
      );
      // Add new items
      const newItems = item.filter(
        (drama) =>
          !tvDetails?.related_title.some(
            (existingDrama: any) => existingDrama.id === drama.id
          )
      );
      const updatedItems = newItems.map((drama, index) => ({
        ...drama,
        story: itemRelatedStories[index] || drama.story,
      }));
      // Combine existing and new updated items
      const allRelatedTitles = [...existingRelatedTitles, ...updatedItems];

      const res = await fetch(`/api/tv/${tv_id}/related`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv_id.toString(),
          related_title: allRelatedTitles,
        }),
      });
      if (res.status === 200) {
        router.refresh();
        reset();
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Server Error");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(error);
    }
  };

  const handleResetChanges = (ind: number) => {
    setIsItemChanging((prevIsItemChanging) => {
      const newIsItemChanging = [...prevIsItemChanging];
      newIsItemChanging[ind] = false;
      return newIsItemChanging;
    });
    setItemRelatedStories((prevStories) => {
      const newRole = [...prevStories];
      newRole[ind] = prevStories[ind];
      return newRole;
    });
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === ind ? false : marked))
    );
  };

  useEffect(() => {
    if (prevItemRef.current !== item) {
    }
    prevItemRef.current = item; // Update the ref with the current item
  }, [item]);

  const isItemChanged = prevItemRef.current !== item;

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <form className="py-3 px-4">
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Related Titles
      </h1>
      <div className="text-left">
        <table className="w-full max-w-full border-collapse bg-transparent mb-4">
          <thead>
            <tr>
              <th className="w-[235px] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Title
              </th>
              <th className="w-[235px] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Story Format
              </th>
              <th className="w-[112px] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
            </tr>
          </thead>
          {item?.length > 0 ? (
            <Reorder.Group
              as="tbody"
              values={item}
              onReorder={setItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {item?.map((related: any, ind) => {
                  const isNew = tvAndMovieResult?.some(
                    (result) => result.id === related.id
                  );
                  return (
                    <Reorder.Item
                      as="tr"
                      value={related}
                      key={related.id}
                      whileDrag={{
                        scale: 1.0,
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                        backgroundColor: "#c2e7b0",
                      }}
                      className="relative w-full"
                      style={{ display: "table-row" }}
                    >
                      <td className="w-3 border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="flex items-start w-full">
                          {!markedForDeletion[ind] && (
                            <span
                              className={`pr-2 ${
                                isNew ? "text-green-500" : ""
                              } ${isItemChanging[ind] ? "text-blue-500" : ""} ${
                                markedForDeletion[ind]
                                  ? "text-red-500 line-through"
                                  : ""
                              }`}
                            >
                              <GiHamburgerMenu />
                            </span>
                          )}
                          <div className="flex-1">
                            <div className="float-left pr-4">
                              <Image
                                src={`https://image.tmdb.org/t/p/original/${
                                  related?.backdrop_path || related?.poster_path
                                }`}
                                alt={related?.name}
                                width={500}
                                height={500}
                                quality={100}
                                className="block w-10 h-12 bg-center bg-cover object-cover leading-10 rounded-sm align-middle pointer-events-none"
                              />
                            </div>
                            <div>
                              <b>
                                <Link
                                  href={`/tv/${related?.id}`}
                                  className={`pointer-events-none ${
                                    isNew ? "text-green-500" : ""
                                  } ${
                                    isItemChanging[ind] ? "text-blue-500" : ""
                                  } ${
                                    markedForDeletion[ind]
                                      ? "text-red-500 line-through"
                                      : ""
                                  }`}
                                >
                                  {related?.name}
                                </Link>
                              </b>
                            </div>
                            <div
                              className={`text-muted-foreground ${
                                isNew ? "text-green-500 opacity-50" : ""
                              } ${
                                isItemChanging[ind]
                                  ? "text-blue-500 opacity-50"
                                  : ""
                              } ${
                                markedForDeletion[ind]
                                  ? "text-red-500 opacity-50 line-through"
                                  : ""
                              }`}
                            >
                              {related?.type?.join("")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-left border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                        <div className="relative">
                          <div className="relative">
                            <input
                              {...register("related_title.story")}
                              type="text"
                              name="related_story"
                              readOnly
                              autoComplete="off"
                              className="w-full h-10 leading-10 text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] hover:border-[#c0c4cc] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 px-4 cursor-pointer"
                              placeholder={
                                itemRelatedStories[ind] || related?.story
                              }
                              onClick={() =>
                                handleDropdownToggle("related_story", ind)
                              }
                            />
                            <IoIosArrowDown className="absolute bottom-3 right-2" />
                          </div>
                          {openDropdown === `related_story-${ind}` && (
                            <AnimatePresence>
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                              >
                                {storyFormat?.map((items, index) => {
                                  const isContentRating = itemRelatedStories[
                                    ind
                                  ]
                                    ? itemRelatedStories[ind] === items?.value
                                    : related?.story === items?.value;
                                  return (
                                    <li
                                      className={`px-5 py-2 cursor-pointer ${
                                        isContentRating
                                          ? "text-[#409eff] bg-[#fff] dark:bg-[#2a2b2c]"
                                          : ""
                                      } `}
                                      onClick={() => {
                                        handleDropdownToggle(
                                          "related_story",
                                          ind
                                        );
                                        setItemRelatedStory(ind, items?.value); // Update the story for this item
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
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent form submission
                              handleResetChanges(ind);
                            }}
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
                            setOpen={setOpen}
                            open={open}
                            handleRemoveItem={handleRemoveItem}
                            ind={ind}
                            setDeleteIndex={setDeleteIndex}
                            item={item}
                            storedData={storedData}
                            setStoredData={setStoredData}
                            markedForDeletion={markedForDeletion}
                            setMarkedForDeletion={setMarkedForDeletion}
                          />
                        )}
                      </td>
                    </Reorder.Item>
                  );
                })}
              </AnimatePresence>
            </Reorder.Group>
          ) : (
            <div className="text-sm px-4 py-2">No records have been added.</div>
          )}
        </table>
      </div>
      <div className="text-left-p-4">
        <div className="float-right w-[50%]">
          <div className="block relative">
            <div className="relative w-full inline-block">
              <input
                type="text"
                className="w-full h-10 leading-10 text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] hover:border-[#c0c4cc] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 px-4"
                placeholder="Search to add a related title"
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
                        {multiSearch?.map((item: any, idx: number) => (
                          <div
                            className={`flex items-center text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer w-full ${
                              listSearch && "force-overflow"
                            }`}
                            key={idx}
                            onClick={() =>
                              onClickAddMovie(item.id, item.media_type)
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
          itemStories?.length > 0 ||
          itemRelatedStories?.length > 0 ||
          isItemChanged
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={
          itemStories?.length > 0 ||
          itemRelatedStories?.length > 0 ||
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

export default RelatedTitle;
