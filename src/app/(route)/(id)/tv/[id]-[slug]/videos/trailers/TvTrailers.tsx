"use client";

import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { CiPlay1 } from "react-icons/ci";
import { formatDuration } from "@/app/actions/formattedDuration";
import { FaYoutube } from "react-icons/fa6";
import { formatDate } from "@/app/actions/formatDate";
import { TrailerType } from "../TvVideo";
interface Youtube {
  thumbnailUrl: string;
  channelName: string;
  duration: string;
}

const TvTrailers: React.FC<TrailerType> = ({ trailer, tv }) => {
  const [openTrailer, setOpenTrailer] = useState<boolean>(true);
  const [thumbnails, setThumbnails] = useState<Youtube[]>([]);
  const api = process.env.YOUTUBE_API_KEY;
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (trailer?.results) {
        const keys = trailer.results.map((item: any) => item.key);
        const promises = keys.map((key: string) =>
          fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${key}&key=${api}`
          ).then((response) => response.json())
        );

        try {
          const responses = await Promise.all(promises);
          const thumbnailsData = responses.map((response: any) => ({
            thumbnailUrl: response.items[0].snippet.thumbnails.medium.url,
            channelName: response.items[0].snippet.channelTitle,
            duration: response.items[0].contentDetails.duration,
          }));
          setThumbnails(thumbnailsData);
        } catch (error) {
          console.error("Error fetching thumbnails:", error);
        }
      }
    };

    fetchThumbnails();
  }, [trailer, api]);

  return (
    <>
      {trailer?.results?.filter((type: any) => type?.type === "Trailer")
        ?.length === 0 ? (
        <p className="relative float-left w-full md:w-[75%] text-center md:text-start -px-3 py-3 my-10">
          There no Trailer for {tv?.title || tv?.name} yet!
        </p>
      ) : (
        <div className="flex flex-col relative float-left w-full md:w-[75%] -px-3 py-3 my-10">
          {trailer?.results
            ?.filter((type: any) => type?.type === "Trailer")
            ?.map((item: any, index: number) => {
              const thumbnailData = thumbnails[index];
              console.log(thumbnailData?.duration);
              return (
                <div
                  className="flex items-start border-[1px] border-[#e3e3e3] rounded-md mb-5"
                  key={index}
                >
                  <div
                    className="flex w-[550px] h-[197px] bg-cover rounded-l-md"
                    style={{
                      backgroundImage: `url(${thumbnailData?.thumbnailUrl})`,
                      position: "relative",
                      backgroundPosition: "center",
                      backgroundSize: "enter",
                    }}
                  >
                    <div
                      className={`fixed top-0 left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] ${
                        openTrailer ? "z-0 hidden" : "z-50"
                      }`}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${item?.key}`}
                        className={`w-full h-full ${
                          openTrailer ? "hidden" : "block"
                        }`}
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
                    <div className="absolute top-[40%] left-[40%] bg-black p-5 rounded-full opacity-50 cursor-pointer">
                      <CiPlay1
                        size={25}
                        className="text-white opacity-100 font-bold"
                        onClick={() => setOpenTrailer(!openTrailer)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full h-[197px]">
                    <div className="w-full pl-4">
                      <h1 className="text-md font-bold pt-2 pb-1">
                        {item?.name}
                      </h1>
                      <h2 className="text-sm">
                        {item?.type} • {formatDuration(thumbnailData?.duration)}{" "}
                        • {formatDate(item?.published_at)}
                      </h2>
                      <p>
                        <span className="inline-block text-xs border-[1px] border-[#e3e3e3] rounded-md p-1">
                          {item?.iso_3166_1}
                        </span>
                      </p>
                    </div>
                    <div className="bg-[#e3e3e3] dark:bg-transparent dark:border-t dark:border-t-gray-400 w-full mt-auto">
                      <p className="inline-flex items-center align-middle pl-4 py-2">
                        <FaYoutube />{" "}
                        <span className="text-sm pl-1">
                          {thumbnailData?.channelName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default TvTrailers;
