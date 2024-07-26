"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import {
  fetchAllKeywords,
  fetchKeyword,
  fetchTv,
} from "@/app/actions/fetchMovieApi";
import { genre_edit } from "@/helper/item-list";
import { customStyles, lightTheme } from "@/helper/MuiStyling";
import { Drama, SearchParamsType, tvId } from "@/helper/type";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

const Genres: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: keywords } = useQuery({
    queryKey: ["keywords"],
    queryFn: () => fetchKeyword(tv_id),
  });
  const [database, setDatabase] = useState<any[]>([]);
  const [keyDatabase, setKeyDatabase] = useState<any[]>([]);
  const [genre, setGenre] = useState<{ name: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>("");
  const [addedKeywords, setAddedKeywords] = useState<{ name: string }[]>([]);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchQueries = useSearchParams();
  const searchQuery = searchQueries?.get("q") || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const gens = genre;
  const keyFromData = tvDetails?.genres_tags?.flatMap(
    (tag: any) => tag?.tag
  ) as any;
  const genreFromData = tvDetails?.genres_tags.flatMap(
    (gen: any) => gen?.genre
  ) as any;

  const {
    data: searchKeywords,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchKeywords", searchQuery],
    queryFn: () => fetchAllKeywords(searchQuery),
  });

  const mergeAndRemoveDuplicates = (array1: any, array2: any): any => {
    const map = new Map<string, any>();
    array1?.forEach((item: any) => map.set(item?.id, item));
    array2?.forEach((item: any) => map.set(item?.name, item));
    return Array.from(map.values());
  };

  const combinedGenresForSelect = [
    ...genre,
    ...(tv?.genres?.map((data: any) => ({
      label: data?.name,
      value: data?.name,
      name: data?.name,
    })) || []),
  ];
  // Create a Set to filter out duplicates
  const uniqueGenresSet = new Set();
  const uniqueCombinedGenresForSelect = combinedGenresForSelect.filter(
    (gen) => {
      const isDuplicate = uniqueGenresSet?.has(gen?.name);
      uniqueGenresSet.add(gen?.name);
      return !isDuplicate;
    }
  );

  useEffect(() => {
    if (
      tvDetails?.genres_tags?.flatMap((item: any) => item?.genre || []) &&
      tvDetails?.genres_tags?.flatMap((item: any) => item?.genre || []).length >
        0
    ) {
      const genreSet = new Set();
      const combinedGenres = [
        ...(tvDetails?.genres_tags?.flatMap((item: any) => item?.genre) || []),
        ...(genre || []),
      ];

      const uniqueGenres = combinedGenres.filter((gen) => {
        if (!genreSet?.has(gen?.name)) {
          genreSet?.add(gen?.name);
          return true;
        }
        return false;
      });

      setDatabase(uniqueGenres);
    } else {
      setDatabase(mergeAndRemoveDuplicates(tv?.genres, genre || []));
    }
  }, [tvDetails?.genres_tags, tv?.genres, genre]);

  useEffect(() => {
    if (
      tvDetails?.genres_tags?.flatMap((item: any) => item?.tag || []) &&
      tvDetails?.genres_tags?.flatMap((item: any) => item?.tag || []).length > 0
    ) {
      const genreSet = new Set();
      const combinedKeys = [
        ...(tvDetails?.genres_tags?.flatMap((item: any) => item?.tag) || []),
        ...(addedKeywords || []),
      ];

      const uniqueGenres = combinedKeys.filter((gen) => {
        if (!genreSet?.has(gen?.name)) {
          genreSet?.add(gen?.name);
          return true;
        }
        return false;
      });

      setKeyDatabase(uniqueGenres);
    } else {
      setKeyDatabase(
        mergeAndRemoveDuplicates(keywords?.results, addedKeywords || [])
      );
    }
  }, [tvDetails?.genres_tags, keywords?.results, addedKeywords]);

  const genreHandler = (name: any) => {
    if (genreFromData?.length > 0) {
      setDatabase(name);
    } else {
      setGenre(name);
    }
  };

  const removeGenre = (valueToRemove: string) => {
    if (genreFromData?.length > 0) {
      setDatabase((prevDatabase) =>
        prevDatabase.filter((gen) => gen?.name !== valueToRemove)
      );
    } else {
      setGenre((prevDatabase) =>
        prevDatabase.filter((gen) => gen?.name !== valueToRemove)
      );
    }
  };

  const onInput = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const { value } = e.target;
      setKeySearch(value);
      // Get current URLSearchParams and update/add the 'q' parameter
      const params = new URLSearchParams(
        searchQueries as unknown as SearchParamsType
      );
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      // Push the new URL with updated search parameters
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    300
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target as Node)
      ) {
        setKeySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addDataToDatabase = (key: string) => {
    setAddedKeywords((prevDatabase) => [...prevDatabase, key] as any);
    setKeySearch("");
  };

  const removeTag = (valueToRemove: string) => {
    if (keyFromData?.length > 0) {
      setKeyDatabase((prevKey) =>
        prevKey.filter((key) => key.name !== valueToRemove)
      );
    } else {
      setAddedKeywords((prevKey) =>
        prevKey.filter((key) => key.name !== valueToRemove)
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      // Function to remove duplicate genres by name
      const removeDuplicateGenres = (genresArray: any) => {
        const uniqueGenres = [] as string[];
        const genreNames = new Set();
        genresArray.forEach((genre: any) => {
          if (!genreNames.has(genre.name)) {
            uniqueGenres.push(genre);
            genreNames.add(genre.name);
          }
        });
        return uniqueGenres;
      };
      // Function to remove duplicate tags by name
      const removeDuplicateTags = (tagsArray: any) => {
        const uniqueTags = [] as string[];
        const tagNames = new Set();
        tagsArray.forEach((tag: any) => {
          if (!tagNames.has(tag.name)) {
            uniqueTags.push(tag);
            tagNames.add(tag.name);
          }
        });
        return uniqueTags;
      };
      const filteredGenres = removeDuplicateGenres(genre);
      // Filter tags to remove duplicates
      const filteredTags = removeDuplicateTags(keyDatabase);
      const res = await fetch(`/api/tv/${tv_id}/genre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv_id.toString(),
          genres_tags: [
            {
              genre: filteredGenres,
              tag: filteredTags,
            },
          ],
        }),
      });
      if (res?.status === 200) {
        toast.success("Success");
        router.refresh();
      } else if (res?.status === 400) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      throw new Error(error?.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const capitalizeFirstLetterOfEachWord = (text: string) => {
    return text?.replace(/\b\w/g, (char) => char?.toUpperCase());
  };

  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Genres & Tags
      </h1>
      <div className="text-left mb-4">
        <label htmlFor="origin_language" className="mb-3 mx-3">
          <b>Genres</b>
        </label>
        <div className="border-2 border-[#ebeef5] rounded-md p-3 m-3">
          {genreFromData?.length > 0
            ? database
                ?.filter((data) => data !== undefined)
                ?.filter(
                  (gen, index, self) =>
                    index === self.findIndex((g) => g?.name === gen?.name)
                )
                ?.map((gen: any, idx: number) => {
                  const datab = genreFromData?.map((item: any) => item?.name);
                  const isExistingGenre = datab?.some(
                    (it: any) => it === gen?.name
                  );
                  return (
                    <span
                      key={idx}
                      className={`inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${
                        !isExistingGenre
                          ? "text-[#5cb85c] bg-[#f9fff9] border-[1px] border-[#5cb85c]"
                          : "bg-[#f0f2f6] dark:bg-white text-[#1675b6] border-[1px] border-[#f0f2f6] dark:border-[#d4d9dd]"
                      }`}
                    >
                      <span className="flex items-center">
                        {gen?.name}
                        <span
                          className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                          onClick={() => removeGenre(gen?.name)}
                        >
                          <IoIosClose />
                        </span>
                      </span>
                    </span>
                  );
                })
            : mergeAndRemoveDuplicates(tv?.genres, genre)
                ?.filter(
                  (gen: any, index: number, self: any) =>
                    index === self.findIndex((g: any) => g?.name === gen?.name)
                )
                .map((gen: any, idx: number) => {
                  const newGenre = gens?.map((n) => n?.name === gen?.name);
                  return (
                    <span
                      key={idx}
                      className={`inline-block  leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${
                        newGenre[idx - 1] === false
                          ? "text-[#5cb85c] bg-[#f9fff9] border-[1px] border-[#5cb85c]"
                          : "bg-[#f0f2f6] dark:bg-white text-[#1675b6] border-[1px] border-[#f0f2f6] dark:border-[#d4d9dd]"
                      }`}
                    >
                      <span className="flex items-center">
                        {gen?.name}
                        <span
                          className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                          onClick={() => removeGenre(gen?.name)}
                        >
                          <IoIosClose />
                        </span>
                      </span>
                    </span>
                  );
                })}
        </div>
        <div className="mx-3" onClick={() => setOpen(!open)}>
          <Select
            isMulti
            options={genre_edit?.map((genre) => ({
              label: genre?.name,
              value: genre?.name,
              name: genre?.name,
            }))}
            value={
              genreFromData?.length > 0
                ? database
                : uniqueCombinedGenresForSelect
            }
            onChange={genreHandler}
            styles={
              resolvedTheme === "dark" ? customStyles(open) : lightTheme(open)
            }
            closeMenuOnSelect={true}
            classNamePrefix="react-select"
            className="w-[50%] production countries"
            onBlur={() => setOpen(false)}
            menuIsOpen
            placeholder="Please enter a genre"
          />
        </div>
      </div>
      <div className="text-left my-8">
        <label htmlFor="origin_language" className="mb-3 mx-3">
          <b>Tags</b>
        </label>
        <div className="text-left mb-3 mx-3">
          <small className="text-muted-foreground opacity-60">
            Click on tag to add or remove spoiler.
          </small>
        </div>
        <div className="border-2 border-[#ebeef5] rounded-md p-3 m-3">
          {keyFromData?.length > 0
            ? keyDatabase?.map((tag, idx) => {
                const datab = keyFromData?.map((item: any) => item?.name);
                const isExistingGenre = datab?.some(
                  (it: any) => it === tag?.name
                );
                return (
                  <span
                    key={idx}
                    className={`inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${
                      isExistingGenre
                        ? "bg-[#fff] text-[#1675b6] border-[1px] border-[#d4d9dd]"
                        : "text-[#5cb85c] bg-[#f9fff9] border-[1px] border-[#5cb85c]"
                    }`}
                  >
                    <span className="flex items-center">
                      {tag?.name
                        ? capitalizeFirstLetterOfEachWord(tag?.name)
                        : "Search for tags"}
                      <span
                        className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                        onClick={() => removeTag(tag?.name)}
                      >
                        <IoIosClose />
                      </span>
                    </span>
                  </span>
                );
              })
            : mergeAndRemoveDuplicates(keywords?.results, addedKeywords)?.map(
                (tag: any, idx: number) => {
                  const newKeys = addedKeywords?.map((n) => n?.name);
                  return (
                    <span
                      key={idx}
                      className={`inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${
                        !newKeys.includes(tag?.name)
                          ? "bg-[#fff] text-[#1675b6] border-[1px] border-[#d4d9dd]"
                          : "text-[#5cb85c] bg-[#f9fff9] border-[1px] border-[#5cb85c]"
                      }`}
                    >
                      <span className="flex items-center">
                        {tag?.name
                          ? capitalizeFirstLetterOfEachWord(tag?.name)
                          : "Search for tags"}
                        <span
                          className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                          onClick={() => removeTag(tag?.name)}
                        >
                          <IoIosClose />
                        </span>
                      </span>
                    </span>
                  );
                }
              )}
        </div>

        <div className="text-left my-5">
          <div className="w-[49%] mx-3">
            <div className="block relative">
              <div className="relative w-full inline-block">
                <input
                  type="text"
                  className="w-full h-10 leading-10 placeholder:text-sm placeholder:text-[#606266] placeholder:opacity-60 text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                  placeholder="Search for tags"
                  ref={inputRef}
                  onChange={onInput}
                />
                <span className="absolute right-3 top-3">
                  <CiSearch />
                </span>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {keySearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={searchResultRef}
              className={`relative block w-[348px] h-[300px] text-black dark:text-white bg-white dark:bg-[#242526] border-2 border-[#dcdfe6] dark:border-[#3e4042] z-20 custom-scroll rounded-md shadow-lg mt-2 ml-3 ${
                openSearch === false ? "block" : "hidden"
              }`}
            >
              {isFetching ? (
                <div className="absolute bottom-[50%] left-[47%]">
                  <ClipLoader color="#fff" size={25} loading={loading} />
                </div>
              ) : (
                <div className="relative">
                  {searchKeywords?.results?.length > 0 ? (
                    searchKeywords?.results?.map((key: any, idx: number) => {
                      const isExistingKeyword = keyDatabase?.some(
                        (k) => k.name === key.name
                      );
                      return (
                        <div
                          className={`flex items-center text-black hover:bg-[#00000011] dark:hover:bg-[#3a3b3c] mb-2 ${
                            keySearch && "force-overflow"
                          } ${
                            isExistingKeyword
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          key={idx}
                          onClick={() =>
                            !isExistingKeyword && addDataToDatabase(key)
                          }
                        >
                          <span
                            className={`text-md  p-4 ${
                              isExistingKeyword
                                ? "text-[#7a8998]"
                                : "text-black dark:text-[#ffffff99]"
                            }`}
                          >
                            {capitalizeFirstLetterOfEachWord(key?.name)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center mt-20">
                      Search result is not found!
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="float-left w-full border-t-2 border-t-[#78828c21] mt-5 pt-5 mx-3">
        <button
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            genre?.length > 1 || addedKeywords?.length > 0
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            genre?.length > 1 || addedKeywords?.length > 0 ? false : true
          }
        >
          <span className="mr-1 pt-1">
            <ClipLoader color="#242526" loading={submitLoading} size={19} />
          </span>
          Submit
        </button>
      </div>
    </form>
  );
};

export default Genres;
