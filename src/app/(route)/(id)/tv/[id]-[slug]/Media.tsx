"use client";

import Link from "next/link";
import React, { useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

const MediaPhoto = ({
  tv,
  mediaActive,
  setMediaActive,
  image,
  video,
  openTrailer,
  setOpenTrailer,
  tv_id,
}: any) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  // Extract video data and thumbnails
  const videos = video
    ?.map((videoData: any) => ({
      key: videoData.items?.[0]?.id,
      thumbnail:
        videoData.items?.[0]?.snippet?.thumbnails?.maxres?.url ||
        videoData.items?.[0]?.snippet?.thumbnails?.high?.url ||
        videoData.items?.[0]?.snippet?.thumbnails?.medium?.url,
      title: videoData.items?.[0]?.snippet?.title,
    }))
    .filter((v: any) => v.key && v.thumbnail);

  const handlePlayVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setOpenTrailer(false);
  };

  const handleCloseVideo = () => {
    setActiveVideoId(null);
    setOpenTrailer(true);
  };

  return (
    <div className="pt-5">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Media</h1>
        <ul className="flex items-center">
          <li
            className={`text-sm md:text-md font-bold ml-5 md:ml-10 hover:opacity-70 transform duration-300 cursor-pointer list-none ${
              mediaActive === "videos"
                ? "border-b-4 border-b-black dark:border-b-[#2196f3]"
                : ""
            }`}
            onClick={() => setMediaActive("videos")}
          >
            Videos {videos?.length}
          </li>
          <li
            className={`text-sm md:text-md font-bold ml-5 md:ml-10 hover:opacity-70 transform duration-300 cursor-pointer list-none ${
              mediaActive === "backdrops"
                ? "border-b-4 border-b-black dark:border-b-[#2196f3]"
                : ""
            }`}
            onClick={() => setMediaActive("backdrops")}
          >
            Backdrops {image?.backdrops?.length}
          </li>
          <li
            className={`text-sm md:text-md font-bold ml-5 md:ml-10 hover:opacity-70 transform duration-300 cursor-pointer list-none ${
              mediaActive === "poster"
                ? "border-b-4 border-b-black dark:border-b-[#2196f3]"
                : ""
            }`}
            onClick={() => setMediaActive("poster")}
          >
            Posters {image?.posters?.length}
          </li>
        </ul>
      </div>
      <div className="relative top-0 left-0 mt-5 overflow-hidden">
        {mediaActive === "videos" && (
          <>
            {!videos?.length ? (
              <p className="flex items-center justify-start">
                There are no videos for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="flex items-center h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap mb-4">
                {videos.map((item: any, index: number) => (
                  <div className="w-[533px] h-[300px] mr-4" key={index}>
                    <div
                      className="w-[533px] h-[300px] bg-cover bg-center border-2 rounded-lg relative"
                      style={{
                        backgroundImage: `url(${item.thumbnail})`,
                      }}
                    >
                      {activeVideoId === item.key && !openTrailer && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] z-50">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${item.key}?autoplay=1`}
                            className="w-full h-full"
                            title={item.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                          <div className="bg-black w-full h-14 absolute -top-12 left-0 right-0 bottom-0 z-9 border-t-black rounded-t-md">
                            <div className="flex items-center justify-between p-4">
                              <h1 className="text-white">{item.title}</h1>
                              <button
                                className="text-white cursor-pointer"
                                onClick={handleCloseVideo}
                                aria-label="Close trailer"
                              >
                                <IoMdCloseCircle size={25} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        className="absolute top-[40%] left-[40%] bg-black p-5 rounded-full opacity-50 cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => handlePlayVideo(item.key)}
                        aria-label="Play video"
                      >
                        <CiPlay1
                          size={25}
                          className="text-white opacity-100 font-bold"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {mediaActive === "backdrops" && (
          <>
            {!image?.backdrops?.length ? (
              <p className="flex items-center justify-center my-10">
                There are no backdrops for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
                <div className="flex items-center h-[300px]">
                  {image.backdrops.slice(0, 6).map((img: any, idx: number) => (
                    <div className="w-[533px] h-[300px] mr-4" key={idx}>
                      <div
                        className="w-[533px] h-[300px] bg-cover border-2 rounded-md"
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/original/${img.file_path})`,
                        }}
                      />
                    </div>
                  ))}
                  <Link
                    prefetch={false}
                    aria-label="Visit Photo page"
                    href={`/tv/${tv_id}/photos`}
                    className="flex items-center text-lg font-bold px-5 hover:opacity-70 transform duration-300 cursor-pointer"
                  >
                    View More
                    <span className="px-2 pt-1">
                      <FaArrowRightToBracket />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
        {mediaActive === "poster" && (
          <>
            {!image?.posters?.length ? (
              <p className="flex items-center justify-center my-10">
                There are no posters for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="flex items-center h-[300px] overflow-hidden overflow-x pb-6 overflow-y-hidden whitespace-nowrap">
                {image.posters.slice(0, 6).map((img: any, idx: number) => (
                  <div className="w-[200px] h-[300px] mr-4" key={idx}>
                    <div
                      className="w-[200px] h-[300px] bg-cover bg-no-repeat align-middle rounded-md border-2"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${img.file_path})`,
                      }}
                    />
                  </div>
                ))}
                <Link
                  prefetch={false}
                  aria-label="Visit Photo page"
                  href={`/tv/${tv_id}/photos/poster`}
                  className="flex items-center text-lg font-bold px-5 hover:opacity-70 transform duration-300 cursor-pointer"
                >
                  View More
                  <span className="px-2 pt-1">
                    <FaArrowRightToBracket />
                  </span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaPhoto;
