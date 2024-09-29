import React from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";

const PersonMovie = ({ data, heading }: any) => {
  const filteredMovie = data?.cast?.filter(
    (item: any) =>
      !item.genre_ids.includes(10764) &&
      !item.genre_ids.includes(16) &&
      !item.genre_ids.includes(10402) &&
      item.genre_ids.length !== 0
  );
  if (filteredMovie?.length === 0) {
    return (
      <div className="text-md font-semibold text-start py-5">
        No data available.
      </div>
    );
  }

  return (
    <div className="relative top-0 left-0 overflow-hidden">
      <h1 className="text-3xl font-bold">{heading}</h1>
      <div className="flex items-center w-full h-[240px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {filteredMovie
          ?.sort(
            (a: any, b: any) =>
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime()
          )
          ?.map((result: any, index: any) => (
            <div
              className={`w-[150px] h-[200px] ${
                index === filteredMovie.length - 1 ? "mr-0" : "mr-4"
              }`}
              key={index}
            >
              <div className="w-[150px] h-[200px] bg-cover">
                <Link
                  href={`/tv/${result?.id}`}
                  className="block hover:relative transform duration-100 group"
                >
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/w500/${
                      result?.poster_path || result?.backdrop_path
                    }`}
                    alt={`${result?.name || result?.title}'s Poster`}
                    width={200}
                    height={250}
                    quality={100}
                    priority
                    className="rounded-xl w-[150px] h-[200px] object-cover"
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-sm pt-1 truncate">
                    {result?.name || result?.title}
                  </p>
                  <p className="text-xs pt-1">
                    {result?.release_date !== "" ? (
                      result?.release_date?.split("-")[0]
                    ) : (
                      <span className="text-[#2490da]">Upcoming</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PersonMovie;
