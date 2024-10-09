"use client";

import DramaRegion from "@/app/(route)/lists/[listId]/edit/DramaRegion";
import { fetchMovie } from "@/app/actions/fetchMovieApi";
import LazyImage from "@/components/ui/lazyimage";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

type FetchingMovie = {
  dynamicSearch: any;
  isFetching: boolean;
  searchQuery: string;
  movieIds: number[];
  setMovieIds: (movieIds: any) => void;
  openSearch: boolean;
  setStoredData: (data: any) => void;
  setItem: (item: any) => void;
  query: string;
};

const FetchingMovie: React.FC<FetchingMovie> = ({
  dynamicSearch,
  isFetching,
  searchQuery,
  movieIds,
  setMovieIds,
  openSearch,
  setStoredData,
  setItem,
  query,
}) => {
  const [listSearch, setListSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
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

  const onInput = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const { value } = e.target;
      setListSearch(value);
      const params = new URLSearchParams(searchQuery as string | any);

      if (value) {
        if (query === "query") {
          params.set("query", value);
          params.delete("q");
        } else {
          params.set("q", value);
          params.delete("query");
        }
      } else {
        if (query === "query") {
          params.delete("query");
        } else {
          params.delete("q");
        }
      }
      router.push(`${pathname}/?${params.toString()}`, {
        scroll: false,
      });
    },
    300
  );

  const onClickAddMovie = async (id: string, mediaType: string) => {
    const parsedId = parseInt(id, 10);
    if (mediaType === "movie" && !movieIds.includes(parsedId)) {
      setMovieIds((prevmovieIds: any) => [...prevmovieIds, parsedId]);
      setListSearch(""); // Clear the search input
    }
    try {
      const movieDetail = await fetchMovie(parsedId);
      if (query === "query") {
        setStoredData((prevData: any) => [...prevData, movieDetail]);
      } else {
        setItem((prevItems: any) => [...prevItems, movieDetail]);
        setStoredData((prevData: any) => [...prevData, movieDetail]);
      }
      setListSearch("");
    } catch (error) {
      console.error("Error adding related title:", error);
      toast.error("Failed to add related title.");
    }
  };
  return (
    <div className="relative w-full inline-block">
      <input
        type="text"
        className="w-full h-10 leading-10 placeholder:text-xs text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] hover:border-[#c0c4cc] text-[#ffffffde] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 transform duration-300 px-4"
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
                <ClipLoader color="#c3c3c3" size={25} loading={loading} />
              </div>
            ) : (
              <>
                {dynamicSearch.map((item: any, idx: number) => (
                  <div
                    className={`flex items-center text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer w-full ${
                      listSearch && "force-overflow"
                    }`}
                    key={idx}
                    onClick={() => onClickAddMovie(item.id, item.media_type)}
                  >
                    <LazyImage
                      src={`https://image.tmdb.org/t/p/${
                        item?.poster_path ? "w154" : "w300"
                      }/${item.poster_path || item.backdrop_path}`}
                      alt={`${item?.name}'s Poster`}
                      width={50}
                      height={50}
                      quality={100}
                      priority
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
  );
};

export default FetchingMovie;
