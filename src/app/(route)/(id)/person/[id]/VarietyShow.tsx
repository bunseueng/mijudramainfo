import React from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";

const Drama = ({ data, heading }: any) => {
  const filteredCast = data?.cast?.filter((item: any) =>
    item?.genre_ids.includes(10764)
  );
  const castLength = filteredCast?.length || 0;

  if (castLength === 0) {
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
        {data?.cast
          ?.filter((item: any) => item.genre_ids.includes(10764))
          ?.sort(
            (a: any, b: any) =>
              new Date(b.first_air_date).getTime() -
              new Date(a.first_air_date).getTime()
          )
          ?.map((item: any, index: any) => (
            <div
              className={`w-[150px] h-[200px] ${
                index === filteredCast.length - 1 ? "mr-0" : "mr-4"
              }`}
              key={index}
            >
              <div className="w-[150px] h-[200px] bg-cover">
                <Link
                  prefetch={true}
                  href={`/tv/${item?.id}`}
                  className="block hover:relative transform duration-100 group"
                >
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/w500/${
                      item?.poster_path || item?.backdrop_path
                    }`}
                    alt={`${item?.name || item?.title}'s Shows`}
                    width={150}
                    height={200}
                    quality={100}
                    priority
                    className="rounded-xl w-[150px] h-[200px] object-cover"
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-sm pt-1 truncate">
                    {item?.name || item?.title}
                  </p>
                  <p className="text-xs pt-1">
                    {item?.first_air_date !== "" ? (
                      item?.first_air_date?.split("-")[0]
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

export default Drama;
