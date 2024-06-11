"use client";

import { fetchMultiSearch } from "@/app/actions/fetchMovieApi";
import { createList, TCreateList } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import DramaRegion from "./DramaRegion";
import MovieResult from "./MovieResult";
import ClipLoader from "react-spinners/ClipLoader";
import { useDebouncedCallback } from "use-debounce";
import ListThumbnail from "./ListThumbnail";
import { EditListProps } from "@/helper/type";

const EditList: React.FC<EditListProps> = ({
  list,
  submittedData,
  yourRating,
  findSpecificRating,
}) => {
  const [openListType, setOpenListType] = useState<boolean>(false);
  const [listType, setListType] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [movieId, setMovieId] = useState<number[]>(list?.movieId?.flat() || []);
  const [tvId, setTvId] = useState<number[]>(list?.tvId?.flat() || []); // New state for TV shows
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [listSearch, setListSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQuery = useSearchParams();
  const pathname = usePathname();
  const query = searchQuery?.get("query") || "";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isLoading },
  } = useForm<TCreateList>({
    resolver: zodResolver(createList),
  });

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

  // Use useEffect to refetch the data when sortby parameter changes
  React.useEffect(() => {
    refetch();
  }, [query, refetch]);

  const onInput = useDebouncedCallback((e: any) => {
    setLoading(true);
    const { name, value } = e.target;
    if (name === "listSearch") {
      setListSearch(value);
    } else {
      setListSearch(value);
    }
    const params = new URLSearchParams(
      searchQuery as
        | string
        | URLSearchParams
        | Record<string, string>
        | string[][]
        | undefined
    );

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}/?${params.toString()}`, {
      scroll: false,
    });
  }, 300);

  const onClickAddMovie = (id: string, mediaType: string) => {
    let isDuplicate = false;
    const parsedId = parseInt(id, 10); // Parse id to number
    if (mediaType === "movie") {
      // Check if the id is already in the movieId array
      isDuplicate = movieId.includes(parsedId);
      if (!isDuplicate) {
        setMovieId((prevMovieId) => [...prevMovieId, parsedId]);
        setListSearch(""); // Clear the search input
      }
    } else if (mediaType === "tv") {
      // Check if the id is already in the tvId array
      isDuplicate = tvId.includes(parsedId);
      if (!isDuplicate) {
        setTvId((prevTvId) => [...prevTvId, parsedId]);
        setListSearch(""); // Clear the search input
      }
    }
  };

  const onSubmit = async (data: TCreateList) => {
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/list/${list?.listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listTitle: data?.listTitle,
          description: data?.description,
          privacy: listType || list?.privacy,
          sortby: sort,
          movieId: movieId,
          tvId: tvId,
        }),
      });
      if (res.status === 200) {
        toast.success("List created successfully");
        reset();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setSubmitLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-3 px-4 md:px-6 my-10">
      <form className="bg-[#272727] border-2 border-[#272727] rounded-md">
        <div className="py-2 px-5">
          <div className="flex items-center justify-between">
            <h1 className="text-black dark:text-white text-xl py-5">
              {list?.listTitle || submittedData?.listTitle}
            </h1>
            <div className="flex items-center">
              <FaRegEyeSlash size={25} className="mr-3" />
              <button className="bg-[#3a3b3c] border-2 border-[#282828] py-3 px-5 mx-2 rounded-md">
                Cancel
              </button>
              <button
                className="bg-[#409effcc] border-2 border-[#409effcc] py-3 px-5 rounded-md mx-2"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </button>
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="title">Title*</label>
            <input
              {...register("listTitle")}
              type="text"
              className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2"
              name="listTitle"
              defaultValue={list?.listTitle || submittedData?.listTitle}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="description">Description*</label>
            <textarea
              {...register("description")}
              className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2"
              name="description"
              defaultValue={list?.description as string}
              placeholder="Type something..."
            ></textarea>
          </div>
          <div className="flex items-center mt-5">
            <div className="w-full flex flex-col mr-3">
              <label htmlFor="type">List Type*</label>
              <div className="relative">
                <div className="relative">
                  <input
                    {...register("privacy")}
                    type="text"
                    name="privacy"
                    readOnly
                    autoComplete="off"
                    placeholder={listType || list?.privacy}
                    className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-pointer"
                    onClick={() => setOpenListType(!openListType)}
                  />
                  <IoIosArrowDown className="absolute bottom-3 right-2" />
                </div>
                <ul
                  className={`w-full absolute bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md z-10 ${
                    openListType ? "block" : "hidden"
                  }`}
                >
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => {
                      setOpenListType(!openListType);
                      setListType("Public list");
                    }}
                  >
                    Public list
                  </li>
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => {
                      setOpenListType(!openListType);
                      setListType("Private list");
                    }}
                  >
                    Private list
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full flex flex-col mr-3">
              <label htmlFor="type">List Content*</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  autoComplete="off"
                  placeholder="Titles"
                  disabled
                  className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-not-allowed"
                />
                <IoIosArrowDown className="absolute bottom-3 right-2 cursor-not-allowed" />
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="type">Sort By*</label>
              <div className="relative">
                <div className="relative">
                  <input
                    {...register("privacy")}
                    type="text"
                    name="privacy"
                    readOnly
                    autoComplete="off"
                    placeholder={list?.sortBy}
                    className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-2 cursor-pointer"
                    onClick={() => setOpenSort(!openSort)}
                  />
                  <IoIosArrowDown className="absolute bottom-3 right-2" />
                </div>
                <ul
                  className={`w-full absolute z-20 bg-[#242424] border-2 border-[#242424] py-3 mt-2 rounded-md ${
                    openSort ? "block" : "hidden"
                  }`}
                >
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => setSort("asc")}
                  >
                    Release Date Ascending
                  </li>
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => setSort("desc")}
                  >
                    Release Date Descending
                  </li>
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => setSort("az")}
                  >
                    Title (A-Z)
                  </li>
                  <li
                    className="hover:bg-[#3a3b3c] px-5 py-3 cursor-pointer"
                    onClick={() => setSort("za")}
                  >
                    Title (Z-A)
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ListThumbnail
            list={list}
            register={register}
            reset={reset}
            handleSubmit={handleSubmit}
          />
          <div className={`relative mt-3 ${listSearch && "searchTooltip"}`}>
            <input
              type="text"
              placeholder="Search to add a new title"
              className="w-full bg-[#3a3b3c] border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 my-5"
              name="listSearch"
              ref={inputRef}
              onChange={onInput}
            />
            <CiSearch className="absolute top-8 right-3" />
            {listSearch && (
              <div
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
                          onClickAddMovie(item?.id, item?.media_type)
                        }
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/original/${
                            item?.poster_path || item?.backdrop_path
                          }`}
                          alt="drama image"
                          width={50}
                          height={50}
                          quality={100}
                          className="bg-cover bg-center mx-4 my-3"
                        />

                        <div className="flex flex-col items-start">
                          <p className="text-[#2490da]">
                            {item?.name || item?.title}
                          </p>
                          <h4>
                            <DramaRegion item={item} />
                          </h4>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            <div className="searchTooltipText"></div>
          </div>
        </div>
        <MovieResult
          setMovieId={setMovieId}
          setTvId={setTvId}
          movieId={movieId}
          tvId={tvId}
          reset={reset}
          list={list}
          handleSubmit={handleSubmit}
          register={register}
          loading={loading}
          yourRating={yourRating}
          findSpecificRating={findSpecificRating}
        />
        <div className="w-full border-t-2 border-t-[#78828c] pt-10">
          <div className="flex items-center justify-between px-4 py-2">
            <button className="flex items-center bg-[#f56c6c4d] text-[#f56c6c] border-2 border-[#f56c6c4d] py-3 px-5 mx-2 rounded-md">
              <span>
                <FiTrash />
              </span>
              <span className="pl-2 pt-[2px]">Delete</span>
            </button>

            <div className="flex items-center">
              <FaRegEyeSlash size={25} className="mr-3" />
              <button className="bg-[#3a3b3c] border-2 border-[#282828] py-3 px-5 mx-2 rounded-md">
                Cancel
              </button>
              <div onClick={() => setSubmitLoading(!submitLoading)}>
                <button
                  className="bg-[#409effcc] border-2 border-[#409effcc] py-3 px-5 rounded-md mx-2"
                  onClick={handleSubmit(onSubmit)}
                >
                  <span className="flex items-center">
                    <ClipLoader
                      color="#fff"
                      size={25}
                      loading={submitLoading}
                    />
                    <span className={`${submitLoading && "ml-2 mt-[2px]"}`}>
                      {submitLoading ? "Saving..." : "Save"}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditList;
