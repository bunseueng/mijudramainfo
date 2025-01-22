import React from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

const PersonMovie = ({ data, heading }: any) => {
  const filteredMovie = data?.cast?.filter(
    (item: any) =>
      !item?.genre_ids.includes(10764) &&
      !item?.genre_ids.includes(16) &&
      !item?.genre_ids.includes(10402) &&
      item?.genre_ids.length !== 0
  );

  // Sort the filtered cast to put upcoming dramas first
  const sortedMovie = filteredMovie?.sort((a: any, b: any) => {
    // If a is upcoming (no first_air_date) and b has a date, a comes first
    if (!a.first_air_date && b.first_air_date) return -1;
    // If b is upcoming and a has a date, b comes first
    if (a.first_air_date && !b.first_air_date) return 1;
    // If both have dates or both are upcoming, maintain original order
    return 0;
  });

  if (sortedMovie?.length === 0) {
    return (
      <div className="text-md font-semibold text-start py-5">
        No data available.
      </div>
    );
  }
  return (
    <section className="w-full overflow-hidden">
      <div className="w-full">
        <h4 className="text-md font-bold mb-1">{heading}</h4>
        <div className="relative top-0 left-0">
          <ul className="w-auto min-h-[221px] flex flex-nowrap justify-start overflow-hidden overflow-x overflow-y-hidden pb-2">
            {sortedMovie?.map((item: any, index: number) => (
              <li
                className={`w-[130px] max-w-[195px] ${
                  index === sortedMovie?.length - 1 ? "mr-0" : "mr-2"
                }`}
                key={index}
              >
                <div className="w-[130px] h-auto bg-cover">
                  <Link
                    rel="preload"
                    href={`/movie/${item?.id}-${spaceToHyphen(
                      item?.title || item?.name
                    )}`}
                    className="block hover:relative transform duration-100 group"
                  >
                    {!item?.poster_path && !item?.backdrop_path ? (
                      <LazyImage
                        src="/placeholder-image.avif"
                        alt={`${item?.name || item?.title}'s Poster`}
                        width={200}
                        height={250}
                        quality={100}
                        priority
                        className="w-[125px] h-[175px] object-cover rounded-md"
                      />
                    ) : (
                      <LazyImage
                        src={`https://image.tmdb.org/t/p/w500/${
                          item?.poster_path || item?.backdrop_path
                        }`}
                        alt={`${item?.name || item?.title}'s Poster`}
                        width={200}
                        height={250}
                        quality={100}
                        priority
                        className="w-[125px] h-[175px] object-cover rounded-md"
                        placeholder="blur"
                        blurDataURL={item?.poster_path || item?.backdrop_path}
                      />
                    )}
                  </Link>
                </div>
                <div className="mt-2 space-y-1 inline-block break-words">
                  <h3 className="text-xs font-medium break-words line-clamp-2 group-hover:text-primary">
                    {item?.name || item?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item?.release_date ? (
                      item?.release_date.split("-")[0]
                    ) : (
                      <span className="text-[#2490da]">Upcoming</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PersonMovie;
