"use client";

import React, { useState } from "react";
import { fetchTrending, fetchVideos } from "@/app/actions/fetchMovieApi";
import { IoMdCloseCircle } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { FaPlay } from "react-icons/fa";

const Trailer = ({ heading }: any) => {
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const { data: trendingVideos, isLoading } = useQuery({
    queryKey: [
      "trendingVideos",
      trending?.results?.map((item: any) => item.id),
    ],
    queryFn: async () => {
      if (!trending?.results) return [];
      const videoPromises = trending.results.map((item: any) =>
        fetchVideos(item.id)
      );
      return Promise.all(videoPromises);
    },
    enabled: !!trending,
  });

  // Filter out trending items that do not have associated videos
  const trendingWithVideos = trending?.results?.filter((result: any) => {
    const videoData = trendingVideos?.find((vid) => vid?.id === result.id);
    return videoData?.results?.length > 0;
  });

  const [clickedVideoId, setClickedVideoId] = useState<string | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<any>(null);
  const [closeVideo, setCloseVideo] = useState<boolean>(false);

  const handleImageClick = (videoId: string) => {
    if (videoId !== clickedVideoId) {
      setClickedVideoId(videoId);
      setCloseVideo(false);
    } else {
      setCloseVideo(!closeVideo);
    }
  };

  const handleImageHover = (imageId: any) => {
    setHoveredImageId(imageId);
  };

  if (isLoading) {
    return <div>Fetching Data...</div>;
  }

  return (
    <section>
      <div className="relative mt-10 mx-4 md:mx-6">
        {trendingWithVideos?.map((result: any, idx: any) => (
          <div
            className="absolute inset-0 overflow-hidden rounded-lg bg-cover bg-no-repeat"
            key={idx}
            style={
              hoveredImageId === result.id
                ? {
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${
                      result?.backdrop_path ||
                      result?.poster_path ||
                      result?.profile_path
                    })`,
                  }
                : !hoveredImageId
                ? {
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${
                      result?.backdrop_path ||
                      result?.poster_path ||
                      result?.profile_path
                    })`,
                  }
                : undefined
            }
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed bg-gradient-to-r from-[rgba(3,37,65,0.25)] via-[rgba(3,37,65,0.20)] to-[rgba(3,37,65,0.25)] bg-opacity-75">
              <div className="">
                <h1 className="text-3xl text-white font-bold p-4">{heading}</h1>
              </div>
            </div>
          </div>
        ))}
        <div className="relative top-0 left-0 mt-5 overflow-hidden">
          <div className="flex items-center w-full h-[250px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4 mt-16 mb-5">
            {trendingWithVideos?.map((result: any, index: any) => {
              // Find the corresponding video for this trending item
              const correspondingVideo = trendingVideos?.find(
                (vid) => vid?.id === result.id
              );

              return (
                <div className="w-[300px] h-[200px] mx-3" key={index}>
                  <div className="w-[300px] h-[200px] bg-cover">
                    <div className="flex flex-col gap-6 group relative shadow-lg text-white rounded-xl px-6 py-8 h-[180px] w-[300px] overflow-hidden cursor-pointer">
                      <div
                        onMouseEnter={() => handleImageHover(result.id)}
                        onMouseLeave={() => handleImageHover(null)}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/original/${
                            result.backdrop_path ||
                            result.poster_path ||
                            result.profile_path
                          })`,
                        }}
                      />
                      {/* Show play button only if corresponding video exists */}
                      <div className="absolute left-[130px] top-[65px] text-white">
                        {correspondingVideo?.results?.length > 0 ? (
                          <FaPlay
                            size={35}
                            onClick={() => handleImageClick(result.id)}
                          />
                        ) : (
                          <span className="text-xs text-gray-300">
                            No Trailer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-[200px] text-white mb-12">
                      <h1 className="text-sm lg:text-md w-full">
                        {result.title || result.name}
                      </h1>
                      <p className="text-sm">{result.first_air_date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {trendingVideos?.map((vid, idx) =>
        vid?.results?.map((result: any, videoIndex: number) => (
          <div key={videoIndex}>
            {clickedVideoId === vid.id && !closeVideo && (
              <div className=" overflow-hidden">
                <div className="relative">
                  <div
                    className={`fixed top-0 left-0 right-0 bottom-0 max-w-6xl m-auto w-[95%] h-[50%] lg:h-[80%] ${
                      closeVideo ? "z-0 hidden" : "z-50"
                    }`}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${result.key}`}
                      className={`w-full h-full ${
                        closeVideo ? "hidden" : "block"
                      }`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div
                      className={`bg-black w-full h-14 absolute -top-12 left-0 right-0 bottom-0 z-9 border-t-black rounded-t-md ${
                        closeVideo ? "hidden" : "block"
                      }`}
                    >
                      <div className="flex items-center justify-between p-4">
                        <h1 className="text-white">Official Trailer</h1>
                        <p
                          className="text-white cursor-pointer"
                          onClick={() => {
                            setCloseVideo(!closeVideo);
                          }}
                        >
                          <IoMdCloseCircle size={25} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
};

export default Trailer;
