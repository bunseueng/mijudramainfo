import type { FetchRecentListProps } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import type React from "react";
import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";

const FetchRecentList: React.FC<FetchRecentListProps> = ({
  tvId,
  movieId,
  index,
  handleMouseEnter,
  handleMouseLeave,
  hoveredIndexes,
  listIndex,
}) => {
  const { data: itemData, isLoading } = useQuery({
    queryKey: ["media", tvId || movieId],
    queryFn: async () => {
      if (tvId) {
        const tv = await fetchTv(tvId.toString());
        return { item: tv, mediaType: "tv" };
      } else if (movieId) {
        const movie = await fetchMovie(movieId.toString());
        return { item: movie, mediaType: "movie" };
      }
      return null;
    },
    enabled: !!tvId || !!movieId,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: false, // Don't refetch when window is focused to reduce API calls
  });

  const item = itemData?.item;
  return (
    <li
      key={index}
      className="w-[72px] h-[108px] -mr-[40px] md:-mr-[35px] lg:-mr-[15px] relative"
      onMouseEnter={() => handleMouseEnter(listIndex, index)}
      onMouseLeave={() => handleMouseLeave(listIndex)}
      style={{
        zIndex: hoveredIndexes[listIndex] === index ? 10 : 5 - index,
      }}
    >
      <div className="flex absolute top-0 left-0">
        {isLoading || !item?.poster_path || !item?.backdrop_path ? (
          <span className="block bg-[#efefef] dark:bg-[#303133] border-2 dark:border-[#303133] rounded-md w-[72px] h-[108px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transform duration-300 hover:transform hover:duration-200 cursor-pointer"></span>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/${
              item?.poster_path ? "w154" : "w300"
            }/${item.poster_path || item?.backdrop_path}`}
            alt={
              itemData?.mediaType === "tv" ? "TV Show Poster" : "Movie Poster"
            }
            width={72}
            height={108}
            className="block rounded-md w-[72px] h-[108px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transform duration-300 cursor-pointer"
            priority
          />
        )}
      </div>
    </li>
  );
};

export default FetchRecentList;
