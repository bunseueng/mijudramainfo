"use client";

import { TrailerVideo } from "@/helper/type";
import React from "react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

interface PlayMovieTrailerProps {
  video: TrailerVideo[] | [];
}
const PlayMovieTrailer: React.FC<PlayMovieTrailerProps> = ({ video }) => {
  const [openTrailer, setOpenTrailer] = useState<boolean>(false); // Each component instance has its own openTrailer state
  return (
    <>
      <div
        className="flex items-center text-white hover:opacity-70 transition duration-300 cursor-pointer"
        onClick={() => setOpenTrailer(true)} // Open the trailer when clicked
      >
        <button
          className={`flex items-center text-white bg-slate-500 py-2 px-4 mt-2 ${
            video?.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          onClick={() => {
            setOpenTrailer(!openTrailer);
          }}
          disabled={video?.length > 0 ? false : true}
        >
          Watch Trailer <FaPlay size={20} className="ml-2" />
        </button>
      </div>
      <div>
        {openTrailer &&
          video &&
          video?.map(
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

export default PlayMovieTrailer;
