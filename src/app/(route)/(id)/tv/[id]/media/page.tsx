import Link from "next/link";
import React from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

export const MediaPage = ({
  tv,
  mediaActive,
  setMediaActive,
  image,
  video,
  thumbnails,
  openTrailer,
  setOpenTrailer,
  tv_id,
}: any) => {
  const ytApi = "AIzaSyD18uVRSrbsFPx6EA8n80GZDt3_srgYu8A";
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
            Videos {video?.results?.length}
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
            {video?.results?.length === 0 ? (
              <p className="flex items-center justify-center my-10">
                There no video for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="flex items-center h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap mb-4">
                {video?.results?.map((item: any, index: number) => (
                  <div className="w-[533px] h-[300px]" key={index}>
                    <div
                      className="w-[533px] h-[300px] bg-cover border-2 rounded-lg"
                      style={{
                        backgroundImage: `url(${thumbnails[index]})`,
                        position: "relative",
                        borderRadius: "8px",
                      }}
                    >
                      <div key={item?.id} className="">
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
                      <div className="absolute top-[40%] left-[40%] bg-black p-5 rounded-full opacity-50 cursor-pointer">
                        <CiPlay1
                          size={25}
                          className="text-white opacity-100 font-bold"
                          onClick={() => setOpenTrailer(!openTrailer)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {mediaActive === "backdrops" && (
          <>
            {image?.backdrops?.length === 0 ? (
              <p className="flex items-center justify-center my-10">
                There no backdrops for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
                <div className="flex items-center h-[300px]">
                  {image?.backdrops
                    ?.slice(0, 6)
                    ?.map((img: any, idx: number) => (
                      <div className="w-[533px] h-[300px]" key={idx}>
                        <div
                          className="w-[533px] h-[300px] bg-cover border-2 rounded-md"
                          style={{
                            backgroundImage: `url(${`https://image.tmdb.org/t/p/original/${img?.file_path}`})`,
                            position: "relative",
                          }}
                        ></div>
                      </div>
                    ))}
                  <Link
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
            {image?.posters?.length === 0 ? (
              <p className="flex items-center justify-center my-10">
                There no posters for {tv?.title || tv?.name} yet!
              </p>
            ) : (
              <div className="flex items-center h-[300px] overflow-hidden overflow-x pb-6 overflow-y-hidden whitespace-nowrap">
                {image?.posters?.slice(0, 6)?.map((img: any, idx: number) => (
                  <div className="w-[200px] h-[300px]" key={idx}>
                    <div
                      className="w-[200px] h-[300px] bg-cover bg-no-repeat align-middle rounded-md border-2"
                      style={{
                        backgroundImage: `url(${`https://image.tmdb.org/t/p/original/${img?.file_path}`})`,
                        position: "relative",
                      }}
                    ></div>
                  </div>
                ))}
                <Link
                  href={`/tv/${tv_id}/photos`}
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
