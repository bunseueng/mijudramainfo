"use client";

import { fetchTrailer } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const PlayTrailer = ({ tv_id }: any) => {
  const [openTrailer, setOpenTrailer] = useState<boolean>(false); // Each component instance has its own openTrailer state
  const { data: trailer } = useQuery({
    queryKey: ["trailer", tv_id], // Include tv_id in the query key
    queryFn: () => fetchTrailer(tv_id),
  });

  return (
    <>
      <div
        className="flex items-center text-white hover:opacity-70 transition duration-300 cursor-pointer"
        onClick={() => setOpenTrailer(true)} // Open the trailer when clicked
      >
        <button
          className="flex items-center text-white bg-slate-500 py-2 px-4 mt-2"
          onClick={() => {
            setOpenTrailer(!openTrailer);
          }}
        >
          Watch Trailer <FaPlay size={20} className="ml-2" />
        </button>
      </div>
      <div>
        {openTrailer &&
          trailer?.results?.map(
            (
              item: any // Display the trailer only when openTrailer is true
            ) => (
              <div key={item?.id} className="relative">
                <div className="fixed top-[96px] left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] z-10">
                  <iframe
                    src={`https://www.youtube.com/embed/${item?.key}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="bg-black w-full h-14 absolute -top-12 left-0 right-0 bottom-0 z-9 border-t-black rounded-t-md">
                    <div className="flex items-center justify-between p-4">
                      <h1 className="text-white">Official Trailer</h1>
                      <p
                        className="text-white cursor-pointer"
                        onClick={() => {
                          setOpenTrailer(false); // Close the trailer when clicked
                        }}
                      >
                        <IoMdCloseCircle size={25} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </>
  );
};

export default PlayTrailer;
