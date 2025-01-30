"use client";

import {
  fetchMovieSearch,
  fetchTv,
  fetchTvSearch,
} from "@/app/actions/fetchMovieApi";
import FetchingTv from "@/app/component/ui/Fetching/FetchingTv";
import LazyImage from "@/components/ui/lazyimage";
import { storyFormat } from "@/helper/item-list";
import type { Drama, tvId } from "@/helper/type";
import { createDetails, type TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrPowerReset } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const DeleteButton = dynamic(
  () => import("@/app/component/ui/Button/DeleteButton"),
  { ssr: false }
);

const RelatedTitle: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [listSearch, setListSearch] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [tvIds, setTvIds] = useState<number[]>(tv_id ? [] : []);
  const [prevStories, setPrevStories] = useState<string[]>([]);
  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.related_title?.length || 0).fill(false)
  );
  const [isItemChanging, setIsItemChanging] = useState<boolean[]>(
    Array(tvDetails?.related_title?.length || 0).fill(false)
  );
  const [hasReordered, setHasReordered] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQuery = useSearchParams();
  const query = searchQuery?.get("q") || "";
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const {
    data: tvAndMovieResults = [],
    refetch: refetchData,
    isLoading,
  } = useQuery({
    queryKey: ["tvAndMovieResults"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvIds.map(async (id: number) => await fetchTv(id.toString()))
      );
      return [...tvDetails];
    },
    enabled: true,
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const {
    data: dynamicSearch,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tvAndMovieSearch", query],
    queryFn: async () => {
      const tvResults = await fetchTvSearch(query);
      const movieResults = await fetchMovieSearch(query);
      return {
        tv: tvResults.results,
        movies: movieResults.results,
      };
    },
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [storedData, setStoredData] = useState<any[]>([]);
  const [item, setItem] = useState<any[]>([]);
  const [itemStories, setItemStories] = useState<string[]>([]);
  const [itemRelatedStories, setItemRelatedStories] = useState<string[]>([]);
  const prevItemRef = useRef(item);
  const [newItems, setNewItems] = useState<Set<number>>(new Set());
  const originalOrderRef = useRef<any[]>([]);

  const getItemStyle = (
    id: number,
    isChanging: boolean,
    isDeleting: boolean
  ) => {
    if (newItems.has(id)) return "text-green-500";
    if (isChanging) return "text-blue-500";
    if (isDeleting) return "text-red-500 line-through";
    return "";
  };

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
      newStories[idx] = true;
      return newStories;
    });
  };

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  const handleRemoveItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indexToRemove: number
  ) => {
    e.preventDefault();
    setItem((prevItems) => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const updatedStoriesMap = itemRelatedStories.reduce(
        (map: any, story, index) => {
          if (story) {
            map[item[index].id] = story;
          }
          return map;
        },
        {}
      );
      const existingRelatedTitles = (tvDetails?.related_title || []).map(
        (drama: any) => ({
          ...drama,
          story: updatedStoriesMap[drama.id] || drama.story,
        })
      );
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
        setHasReordered(false);
        originalOrderRef.current = [...allRelatedTitles];
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Server Error");
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChanges = (idx: number) => {
    setItemRelatedStories((prevStories) => {
      const newStories = [...prevStories];
      newStories[idx] = "";
      return newStories;
    });
    setIsItemChanging((prevIsItemChanging) => {
      const newIsItemChanging = [...prevIsItemChanging];
      newIsItemChanging[idx] = false;
      return newIsItemChanging;
    });
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === idx ? false : marked))
    );
  };

  const hasChanges = () => {
    const hasStoryChanges =
      itemStories.some((story) => story !== "") ||
      itemRelatedStories.some((story) => story !== "");
    const hasDeletedItems = markedForDeletion.some((marked) => marked);
    const hasNewItems = newItems.size > 0;
    const hasReorderedItems = hasReordered;
    const hasModifiedItems = isItemChanging.some((changing) => changing);

    return (
      hasStoryChanges ||
      hasDeletedItems ||
      hasNewItems ||
      hasReorderedItems ||
      hasModifiedItems
    );
  };

  useEffect(() => {
    if (tvAndMovieResults.length > 0) {
      setItemStories(Array(tvAndMovieResults.length).fill(""));
    }
  }, [tvAndMovieResults]);

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
    const addingItems =
      storedData?.map((data) => ({
        ...data,
        story: itemRelatedStories,
      })) || [];

    const newItems = addingItems.filter(
      (item) =>
        !tvDetails?.related_title.some(
          (existingItem: any) => existingItem.id === item.id
        )
    );

    setNewItems(new Set(newItems.map((item) => item.id)));

    const allItems = [...addingItems, ...(tvDetails?.related_title || [])];

    if (allItems.length > 0) {
      setItem(allItems);
      if (originalOrderRef.current.length === 0) {
        originalOrderRef.current = [...allItems];
      }
    } else {
      setItem(storedData);
    }
  }, [tvDetails?.related_title, storedData, itemRelatedStories]);

  useEffect(() => {
    refetchData();
  }, [refetchData]);

  useEffect(() => {
    if (prevItemRef.current !== item) {
      const isReordered =
        JSON.stringify(originalOrderRef.current) !== JSON.stringify(item);
      setHasReordered(isReordered);
    }
    prevItemRef.current = item;
  }, [item]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  if (isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
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
              onReorder={(newOrder) => {
                setItem(newOrder);
                const isReordered =
                  JSON.stringify(originalOrderRef.current) !==
                  JSON.stringify(newOrder);
                setHasReordered(isReordered);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {item?.map((related: any, idx) => {
                  const itemStyle = getItemStyle(
                    related.id,
                    isItemChanging[idx],
                    markedForDeletion[idx]
                  );
                  return (
                    <Reorder.Item
                      as="tr"
                      value={related}
                      key={related?.id}
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
                          {!markedForDeletion[idx] && (
                            <span className={`pr-2 ${itemStyle}`}>
                              <GiHamburgerMenu />
                            </span>
                          )}
                          <div className="flex-1">
                            <div className="float-left pr-4">
                              <LazyImage
                                src={`https://image.tmdb.org/t/p/${
                                  related?.backdrop_path ? "w300" : "w154"
                                }/${
                                  related?.backdrop_path || related?.poster_path
                                }`}
                                alt={related?.name || "Images"}
                                width={100}
                                height={48}
                                quality={80}
                                priority
                                className="block w-10 h-12 bg-center bg-cover object-cover leading-10 rounded-sm align-middle pointer-events-none"
                              />
                            </div>
                            <div>
                              <b>
                                <Link
                                  prefetch={false}
                                  href={`/tv/${related?.id}`}
                                  className={`pointer-events-none ${itemStyle}`}
                                >
                                  {related?.name || related?.title}
                                </Link>
                              </b>
                            </div>
                            <div
                              className={`text-muted-foreground ${itemStyle} opacity-50`}
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
                                itemRelatedStories[idx] || related?.story
                              }
                              onClick={() =>
                                handleDropdownToggle("related_story", idx)
                              }
                            />
                            <IoIosArrowDown className="absolute bottom-3 right-2" />
                          </div>
                          {openDropdown === `related_story-${idx}` && (
                            <AnimatePresence>
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full h-[250px] absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll"
                              >
                                {storyFormat?.map((items, idxex) => {
                                  const isContentRating = itemRelatedStories[
                                    idx
                                  ]
                                    ? itemRelatedStories[idx] === items?.value
                                    : related?.story === items?.value;
                                  return (
                                    <li
                                      className={`px-5 py-2 cursor-pointer z-10 ${
                                        isContentRating
                                          ? "text-[#409eff] bg-[#fff] dark:bg-[#2a2b2c]"
                                          : ""
                                      } `}
                                      onClick={() => {
                                        handleDropdownToggle(
                                          "related_story",
                                          idx
                                        );
                                        setItemRelatedStory(idx, items?.value);
                                      }}
                                      key={idxex}
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
                        {markedForDeletion[idx] || isItemChanging[idx] ? (
                          <button
                            name="Reset"
                            type="button"
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                            onClick={(e) => {
                              e.preventDefault();
                              handleResetChanges(idx);
                            }}
                          >
                            <GrPowerReset />
                          </button>
                        ) : (
                          <button
                            className="min-w-10 bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                            onClick={(e) => {
                              setOpen(!open), e.preventDefault();
                              setDeleteIndex(idx);
                            }}
                          >
                            <IoCloseOutline />
                          </button>
                        )}
                        {open && deleteIndex === idx && (
                          <DeleteButton
                            setOpen={setOpen}
                            open={open}
                            handleRemoveItem={handleRemoveItem}
                            ind={idx}
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
            <tbody>
              <tr>
                <td colSpan={3} className="text-sm px-4 py-2">
                  No records have been added.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="text-left-p-4">
        <div className="float-right w-[50%]">
          <div className="block relative">
            <FetchingTv
              dynamicSearch={dynamicSearch as any}
              isFetching={isFetching}
              searchQuery={searchQuery as string | any}
              mediaIds={mediaIds}
              setMediaIds={setMediaIds}
              setStoredData={setStoredData}
              openSearch={openSearch}
              setItem={setItem}
              query={query}
            />
          </div>
        </div>
      </div>
      <button
        name="submit"
        type="submit"
        className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          hasChanges() && !loading
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={!hasChanges() || loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
      </button>
    </form>
  );
};

export default RelatedTitle;
