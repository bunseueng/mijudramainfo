"use client";

import React from "react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const PlayTrailerBtn = ({ trailer, textColor }: any) => {
  const [openTrailer, setOpenTrailer] = useState<boolean>(true);

  return (
    <>
      <div
        className="flex items-center text-white hover:opacity-70 transition duration-300 cursor-pointer"
        onClick={() => setOpenTrailer(!openTrailer)}
        style={{ color: textColor }}
      >
        <FaPlay size={25} />
        <p className="pl-3 text-lg font-bold">Play Trailer</p>
      </div>
      <div>
        {trailer?.results?.map((item: any) => (
          <div key={item?.id} className="relative">
            <div
              className={`fixed top-10 left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] ${
                openTrailer ? "z-0 hidden" : "z-50"
              }`}
            >
              <iframe
                src={`https://www.youtube.com/embed/${item?.key}`}
                className={`w-full h-full ${openTrailer ? "hidden" : "block"}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div
                className={`bg-black w-full h-14 absolute -top-12 left-0 right-0 bottom-0 z-9 border-t-black rounded-t-md ${
                  openTrailer ? "hidden" : "block"
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <h1 className="text-white">Official Trailer</h1>
                  <p
                    className="text-white cursor-pointer"
                    onClick={() => {
                      setOpenTrailer(!openTrailer);
                    }}
                  >
                    <IoMdCloseCircle size={25} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayTrailerBtn;
