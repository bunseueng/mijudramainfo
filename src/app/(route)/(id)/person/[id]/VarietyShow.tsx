import React from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";

const Drama = ({ data, heading }: any) => {
  const filteredCast = data?.cast?.filter((item: any) =>
    item?.genre_ids.includes(10764)
  );
  const castLength = filteredCast?.length || 0;
  console.log(data);

  if (castLength === 0) {
    return (
      <div className="text-md font-semibold text-start py-5">
        No data available.
      </div>
    );
  }

  return (
    <div className="relative top-0 left-0 mt-5 overflow-hidden">
      <h1 className="text-3xl font-bold my-5">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data?.cast
          ?.filter((item: any) => item.genre_ids.includes(10764))
          ?.sort(
            (a: any, b: any) =>
              new Date(b.first_air_date).getTime() -
              new Date(a.first_air_date).getTime()
          )
          ?.map((item: any, index: any) => (
            <div className="w-[200px] h-[280px] mr-8" key={index}>
              <div className="w-[200px] h-[280px] bg-cover">
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
                    width={200}
                    height={250}
                    quality={100}
                    priority
                    className="rounded-xl w-[200px] h-[250px] object-cover"
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <p className="truncate">{item?.name || item?.title}</p>
                  <p>
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
