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
    <section className="w-full overflow-hidden">
      <div className="w-full">
        <h1 className="text-xl font-bold mb-1">{heading}</h1>
        <div className="relative top-0 left-0">
          <ul className="w-auto min-h-[221px] flex flex-nowrap justify-start overflow-hidden overflow-x overflow-y-hidden pb-2">
            {filteredCast?.map((item: any, index: number) => (
              <li
                className={`w-[130px] max-w-[195px] ${
                  index === filteredCast?.length - 1 ? "mr-0" : "mr-2"
                }`}
                key={index}
              >
                <div className="w-[130px] h-auto bg-cover">
                  <Link
                    rel="preload"
                    href={`/tv/${item?.id}`}
                    className="block hover:relative transform duration-100 group"
                  >
                    <LazyImage
                      src={`https://image.tmdb.org/t/p/w500/${
                        item?.poster_path || item?.backdrop_path
                      }`}
                      alt={`${item?.poster_path}'s Poster`}
                      width={200}
                      height={250}
                      quality={100}
                      priority
                      className="w-[125px] h-[175px] object-cover rounded-md"
                    />
                  </Link>
                </div>
                <div className="mt-2 space-y-1 inline-block break-words">
                  <h3 className="text-xs font-medium break-words line-clamp-2 group-hover:text-primary">
                    {item?.name || item?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item?.first_air_date ? (
                      item?.first_air_date.split("-")[0]
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

export default Drama;
