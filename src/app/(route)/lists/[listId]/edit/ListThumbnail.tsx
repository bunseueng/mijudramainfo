"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ListThumbnailProps } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";

const ListThumbnail: React.FC<ListThumbnailProps> = ({
  list,
  tvId,
  movieId,
  reset,
}) => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: tvAndMovieResult = [], refetch: refetchData } = useQuery({
    queryKey: ["tvAndMovieResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvId.map(async (id: any) => await fetchTv(id))
      );
      const movieDetails = await Promise.all(
        movieId.map(async (id: any) => await fetchMovie(id))
      );
      return [...tvDetails, ...movieDetails];
    },
    enabled: true, // Ensures the query runs immediately
  });

  useEffect(() => {
    refetchData();
  }, [movieId, tvId, refetchData]);

  const onUpload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/list/${list?.listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thumbnail: thumbnail,
        }),
      });
      if (res.status === 200) {
        toast.success("Thumbnail updated successfully");
        reset();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };
  return (
    <div className="mt-5">
      <label htmlFor="type">List Thumbnail*</label>
      <div className="flex flex-col md:flex-row md:items-center mt-5"></div>
      {tvAndMovieResult?.map((result, idx) => {
        return (
          <div
            className="relative inline-block mr-5"
            key={idx}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
            onClick={() => {
              const newThumbnail = result?.backdrop_path || result?.poster_path;
              setThumbnail(newThumbnail);
              onUpload();
            }}
          >
            {(result?.backdrop_path || result?.poster_path) && (
              <Image
                src={`${
                  result?.backdrop_path || result?.poster_path === null
                    ? `https://image.tmdb.org/t/p/original/${
                        result?.backdrop_path || result?.poster_path
                      }`
                    : "/empty-img.jpg"
                }`}
                alt={`${result?.name || result?.title} image` || "Drama Poster"}
                width={400}
                height={400}
                quality={100}
                className="w-[400px] h-[200px] bg-cover object-cover rounded-md hover:bg-black hover:bg-opacity-40 transform duration-300 cursor-pointer"
              />
            )}
            <div
              className={`absolute top-[40%] left-0 right-0 text-center text-white font-bold bg-cyan-400 uppercase py-2 cursor-pointer transition-opacity duration-300 ease-in-out ${
                hover === idx ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              Select this image
            </div>
            {list?.thumbnail?.includes(
              result?.backdrop_path || result?.poster_path
            ) && (
              <div className="absolute top-[40%] left-0 right-0 text-center text-white font-bold bg-cyan-400 uppercase py-2 cursor-pointer transition-opacity duration-300 ease-in-out">
                Selected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListThumbnail;
