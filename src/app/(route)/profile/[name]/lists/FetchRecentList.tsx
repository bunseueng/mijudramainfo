import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";
import { FetchRecentListProps } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const FetchRecentList: React.FC<FetchRecentListProps> = ({
  tvId,
  movieId,
  index,
  handleMouseEnter,
  handleMouseLeave,
  hoveredIndexes,
  listIndex,
}) => {
  const fetchDetails = async () => {
    if (tvId) {
      const tvData = await fetchTv(tvId);
      return { item: tvData, mediaType: "tv" };
    } else if (movieId) {
      const movieData = await fetchMovie(movieId);
      return { item: movieData, mediaType: "movie" };
    }
    return null;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: itemData, isLoading } = useQuery({
    queryKey: ["tv", tvId, "movie", movieId],
    queryFn: fetchDetails,
    enabled: !!tvId || !!movieId,
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const item = itemData?.item;
  return (
    <li
      key={index}
      className="w-[72px] h-[108px] md:-mr-[35px] lg:-mr-[15px] relative"
      onMouseEnter={() => handleMouseEnter(listIndex, index)}
      onMouseLeave={() => handleMouseLeave(listIndex)}
      style={{
        zIndex: hoveredIndexes[listIndex] === index ? 10 : 5 - index,
      }}
    >
      <div className="flex absolute top-0 left-0">
        {isLoading || !item?.poster_path ? (
          <span className="block bg-[#efefef] dark:bg-[#303133] border-2 dark:border-[#303133] rounded-md w-[72px] h-[108px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transform duration-300 hover:transform hover:duration-200 cursor-pointer"></span>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
            alt={
              itemData?.mediaType === "tv" ? "TV Show Poster" : "Movie Poster"
            }
            width={200}
            height={200}
            quality={100}
            className="block rounded-md w-[72px] h-[108px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transform duration-300 cursor-pointer"
            priority
          />
        )}
      </div>
    </li>
  );
};

export default FetchRecentList;
