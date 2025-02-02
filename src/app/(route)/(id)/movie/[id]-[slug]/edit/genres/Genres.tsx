"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import { fetchAllKeywords } from "@/app/actions/fetchMovieApi";
import { genre_edit } from "@/helper/item-list";
import { customStyles, lightTheme } from "@/helper/MuiStyling";
import { Movie, movieId, SearchParamsType } from "@/helper/type";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { useMovieData } from "@/hooks/useMovieData";

interface Genre {
  label: string;
  value: string;
}

interface Tag {
  name: string;
}

interface GenresTagsData {
  genre: Genre[];
  tag: Tag[];
}

interface MovieDetails extends Movie {
  genres_tags?: GenresTagsData[];
}

const GenresAndTags: React.FC<movieId & { movieDetails?: MovieDetails }> = ({
  movie_id,
  movieDetails,
}) => {
  const { movie } = useMovieData(movie_id);
  const keywords = movie?.keywords || [];
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [originalGenres, setOriginalGenres] = useState<Genre[]>([]);
  const [originalTags, setOriginalTags] = useState<Tag[]>([]);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [openGenres, setOpenGenres] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchQueries = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const searchQuery = searchQueries?.get("q") || "";

  const {
    data: searchKeywords,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchKeywords", searchQuery],
    queryFn: () => fetchAllKeywords(searchQuery),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (movieDetails?.genres_tags && movieDetails.genres_tags.length > 0) {
      const genresTagsData = movieDetails.genres_tags[0];
      if (
        genresTagsData &&
        "genre" in genresTagsData &&
        "tag" in genresTagsData
      ) {
        const initialGenres = genresTagsData.genre || [];
        const initialTags = genresTagsData.tag || [];
        setGenres(initialGenres);
        setTags(initialTags);
        setOriginalGenres(initialGenres);
        setOriginalTags(initialTags);
      }
    } else if (movie?.genres) {
      const initialGenres = movie.genres.map((genre: any) => ({
        label: genre.name,
        value: genre.name,
      }));
      const initialTags = keywords?.keywords?.map((k: any) => ({
        name: k?.name,
        value: k?.name,
      }));
      setGenres(initialGenres);
      setOriginalGenres(initialGenres);
      setTags(initialTags);
      setOriginalTags(initialTags);
    }
  }, [movieDetails, movie, keywords?.keywords]);

  const genreHandler = (selectedOptions: Genre[]) => {
    setGenres(selectedOptions || []);
  };

  const removeGenre = (valueToRemove: string) => {
    setGenres((prevGenres) =>
      prevGenres.filter((genre) => genre.value !== valueToRemove)
    );
  };

  const addTag = (tag: string) => {
    setTags((prevTags) => [...prevTags, { name: tag }]);
    setKeySearch("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.name !== tagToRemove));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const res = await fetch(`/api/movie/${movie_id}/genre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie_id.toString(),
          genres_tags: [
            {
              genre: genres,
              tag: tags,
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

  const getStyle = (item: Genre | Tag, isOriginal: boolean) => {
    if (isOriginal) {
      return "bg-[#f0f2f6] dark:bg-white text-[#1675b6] border-[1px] border-[#f0f2f6] dark:border-[#d4d9dd]";
    } else {
      return "text-[#5cb85c] bg-[#f9fff9] border-[1px] border-[#5cb85c]";
    }
  };

  const onInput = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const { value } = e.target;
      setKeySearch(value);
      const params = new URLSearchParams(
        searchQueries as unknown as SearchParamsType
      );
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
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
        setOpenSearch(false);
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

  const capitalizeFirstLetterOfEachWord = (text: string) => {
    return text?.replace(/\b\w/g, (char) => char?.toUpperCase());
  };

  const isChanged = () => {
    return (
      JSON.stringify(genres) !== JSON.stringify(originalGenres) ||
      JSON.stringify(tags) !== JSON.stringify(originalTags)
    );
  };

  return (
    <form className="py-3 px-4" onSubmit={onSubmit}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Genres & Tags
      </h1>
      <div className="text-left mb-4">
        <label htmlFor="genres" className="mb-3 mx-3">
          <b>Genres</b>
        </label>
        <div className="border-[1px] border-[#ebeef5] rounded-md p-3 m-3">
          {genres.map((genre, idx) => (
            <span
              key={idx}
              className={`inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${getStyle(
                genre,
                originalGenres.some((g) => g.value === genre.value)
              )}`}
            >
              <span className="flex items-center">
                {genre.label}
                <span
                  className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                  onClick={() => removeGenre(genre.value)}
                >
                  <IoIosClose />
                </span>
              </span>
            </span>
          ))}
          {originalGenres
            .filter((og) => !genres.some((g) => g.value === og.value))
            .map((genre, idx) => (
              <span
                key={`removed-${idx}`}
                className="inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 text-[#d9534f] bg-[#fdf7f7] border-[1px] border-[#d9534f] line-through"
              >
                <span className="flex items-center">{genre.label}</span>
              </span>
            ))}
        </div>
        <div className="mx-3" onClick={() => setOpenGenres(!openGenres)}>
          <Select
            isMulti
            options={genre_edit.map((genre) => ({
              label: genre.name,
              value: genre.name,
            }))}
            value={genres}
            onChange={genreHandler as any}
            styles={
              resolvedTheme === "dark"
                ? customStyles(openGenres)
                : lightTheme(openGenres)
            }
            closeMenuOnSelect={false}
            classNamePrefix="react-select"
            className="w-full"
            menuIsOpen={openGenres}
            onBlur={() => setOpenGenres(false)}
            placeholder="Please select genres"
            isClearable={true}
          />
        </div>
      </div>

      <div className="text-left my-8">
        <label htmlFor="tags" className="mb-3 mx-3">
          <b>Tags</b>
        </label>
        <div className="text-left mb-3 mx-3">
          <small className="text-muted-foreground opacity-60">
            Click on tag to add or remove spoiler.
          </small>
        </div>
        <div className="border-[1px] border-[#ebeef5] rounded-md p-3 m-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 ${getStyle(
                tag,
                originalTags.some((t) => t.name === tag.name)
              )}`}
            >
              <span className="flex items-center">
                {capitalizeFirstLetterOfEachWord(tag.name)}
                <span
                  className="text-lg ml-2 hover:text-white hover:bg-[#1675b6] hover:rounded-full cursor-pointer"
                  onClick={() => removeTag(tag.name)}
                >
                  <IoIosClose />
                </span>
              </span>
            </span>
          ))}
          {originalTags
            .filter((ot) => !tags.some((t) => t.name === ot.name))
            .map((tag, idx) => (
              <span
                key={`removed-${idx}`}
                className="inline-block leading-8 text-sm whitespace-nowrap rounded-md mb-2 mr-2 px-2 text-[#d9534f] bg-[#fdf7f7] border-[1px] border-[#d9534f] line-through"
              >
                <span className="flex items-center">
                  {capitalizeFirstLetterOfEachWord(tag.name)}
                </span>
              </span>
            ))}
        </div>

        <div className="text-left my-5">
          <div className="w-[49%] mx-3">
            <div className="block relative">
              <div className="relative w-full inline-block">
                <input
                  type="text"
                  className="w-full h-10 leading-10 placeholder:text-sm placeholder:text-[#606266] placeholder:opacity-60 text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 px-4"
                  placeholder="Search for tags"
                  ref={inputRef}
                  onChange={onInput}
                  onFocus={() => setOpenSearch(true)}
                />
                <span className="absolute right-3 top-3">
                  <CiSearch />
                </span>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {openSearch && keySearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={searchResultRef}
              className="relative block w-[348px] h-[300px] text-black dark:text-white bg-white dark:bg-[#242526] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] z-20 custom-scroll rounded-md shadow-lg mt-2 ml-3"
            >
              {isFetching ? (
                <div className="absolute bottom-[50%] left-[47%]">
                  <ClipLoader color="#c0c4cc" size={25} loading={loading} />
                </div>
              ) : (
                <div className="relative">
                  {searchKeywords?.results?.length > 0 ? (
                    searchKeywords?.results?.map((key: any, idx: number) => {
                      const isExistingTag = tags.some(
                        (t) => t.name === key.name
                      );
                      return (
                        <div
                          className={`flex items-center text-black hover:bg-[#00000011] dark:hover:bg-[#3a3b3c] mb-2 ${
                            keySearch && "force-overflow"
                          } ${
                            isExistingTag
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          key={idx}
                          onClick={() => !isExistingTag && addTag(key.name)}
                        >
                          <span
                            className={`text-md p-4 ${
                              isExistingTag
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
          name="Submit"
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            isChanged()
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={!isChanged()}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default GenresAndTags;
