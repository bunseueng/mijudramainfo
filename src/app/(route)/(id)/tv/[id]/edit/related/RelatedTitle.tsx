"use client";

import DramaRegion from "@/app/(route)/lists/[listId]/edit/DramaRegion";
import { fetchMultiSearch, fetchTv } from "@/app/actions/fetchMovieApi";
import DeleteButton from "@/app/component/ui/Button/DeleteButton";
import { storyFormat } from "@/helper/item-list";
import { Drama, DramaDetails, tvId } from "@/helper/type";
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
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const RelatedTitle: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [listSearch, setListSearch] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [tvIds, setTvIds] = useState<number[]>(tv_id ? [] : []);
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

  const [item, setItem] = useState([
    ...tvAndMovieResult,
    ...(tvDetails?.related_title || []),
  ]);

  useEffect(() => {
    refetchData();
  }, [tvIds, refetchData]);

  const [detail]: DramaDetails[] = (tvDetails?.details ||
    []) as unknown as DramaDetails[];

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

  const [itemStories, setItemStories] = useState<string[]>([]);
  const [itemRelatedStories, setItemRelatedStories] = useState<string[]>([]);

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
  };

  const onClickAddMovie = async (id: string, mediaType: string) => {
    const parsedId = parseInt(id, 10);
    if (mediaType === "tv" && !tvIds.includes(parsedId)) {
      setTvIds((prevTvIds) => [...prevTvIds, parsedId]);
      setListSearch(""); // Clear the search input
    }
    try {
      const tvDetail = await fetchTv(parsedId);
      setItem((prevItems) => [...prevItems, tvDetail]);
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
      const updatedItems = item.map((drama, index) => ({
        ...drama,
        story: itemRelatedStories[index],
      }));

      // Combine old and new related titles
      const allRelatedTitles = [
        ...(tvDetails?.related_title || []),
        ...updatedItems,
      ];

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
        console.log("Bad Request");
      }
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    }
  };
  console.log(itemRelatedStories);
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
              <th className="w-[235px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Title
              </th>
              <th className="w-[235px] border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4">
                Story Format
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
              {item?.map((related: any, ind) => (
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
                  <td className="w-3 border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                    <div className="flex items-start w-full">
                      <span className="pr-2">
                        <GiHamburgerMenu />
                      </span>
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
                              className="pointer-events-none"
                            >
                              {related?.name}
                            </Link>
                          </b>
                        </div>
                        <div className="text-muted-foreground">
                          {detail?.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-left border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                    <div className="relative">
                      <div className="relative">
                        <input
                          {...register("related_title.story")}
                          type="text"
                          name="related_story"
                          readOnly
                          autoComplete="off"
                          className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
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
                            className={`w-full h-auto absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 overflow-y-auto `}
                          >
                            {storyFormat?.map((items, index) => {
                              const isContentRating = itemRelatedStories[ind]
                                ? itemRelatedStories[ind] === items?.value
                                : related?.story === items?.value;
                              return (
                                <li
                                  className={`px-5 py-2 cursor-pointer ${
                                    isContentRating
                                      ? "text-[#409eff] bg-[#2a2b2c]"
                                      : ""
                                  } `}
                                  onClick={() => {
                                    handleDropdownToggle("related_story", ind);
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
              ))}
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
                        {multiSearch?.map((item: any, idx: number) => (
                          <div
                            className={`flex items-center hover:bg-[#3a3b3c] cursor-pointer ${
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

                            <div className="flex flex-col items-start">
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
        className={`flex items-center bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          itemStories?.length > 0
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={itemStories?.length > 0 ? false : true}
      >
        Submit
      </button>
    </form>
  );
};

export default RelatedTitle;
