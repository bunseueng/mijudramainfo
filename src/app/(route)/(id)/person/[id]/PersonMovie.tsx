"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const PersonMovie = ({ data, heading }: any) => {
  if (data?.cast?.length === 0) {
    return (
      <div className="text-lg font-bold text-center py-5">
        Sorry!! This person currently has no movie.
      </div>
    );
  }

  return (
    <div className="relative top-0 left-0 mt-5 overflow-hidden">
      <h1 className="text-3xl font-bold my-5">{heading}</h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        {data?.cast
          ?.filter((item: any) => item?.genre_ids?.length > 0)
          ?.sort(
            (a: any, b: any) =>
              new Date(b.first_air_date).getTime() -
              new Date(a.first_air_date).getTime()
          )
          ?.map((result: any, index: any) => (
            <div className="w-[200px] h-[280px] mr-8" key={index}>
              <div className="w-[200px] h-[280px] bg-cover">
                <Link
                  href={`/tv/${result?.id}`}
                  className="block hover:relative transform duration-100 group"
                >
                  {result?.poster_path || result?.backdrop_path !== null ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${
                        result?.poster_path || result?.backdrop_path
                      }`}
                      alt="tv image"
                      width={600}
                      height={600}
                      quality={100}
                      className="rounded-xl w-[200px] h-[250px] object-cover"
                    />
                  ) : (
                    <Image
                      src="/empty-img.jpg"
                      alt="tv image"
                      width={600}
                      height={600}
                      quality={100}
                      className="rounded-xl w-[200px] h-[250px] object-cover"
                    />
                  )}
                </Link>
                <div className="flex items-center justify-between">
                  <p className="truncate">{result?.name || result?.title}</p>
                  <p>{Math.round(result?.vote_average * 10)}%</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PersonMovie;
