"use client";

import ColorThief from "colorthief";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { fetchTv } from "@/app/actions/fetchMovieApi";
import { VscQuestion } from "react-icons/vsc";
import { tvVideoList } from "@/helper/item-list";
import { usePathname, useRouter } from "next/navigation";
import { DramaDB } from "@/helper/type";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import LazyImage from "@/components/ui/lazyimage";
import TvTrailers from "./trailers/TvTrailers";
import TvTeasers from "./teasers/TvTeasers";
import Clips from "./clips/Clips";
import BehindTheScenes from "./behind_the_scenes/BehindTheScenes";
import Bloopers from "./bloopers/Bloopers";
import Featurettes from "./featurettes/Featurettes";
import OpeningCredits from "./opening_credits/OpeningCredits";

interface TvTrailerType {
  tv_id: string;
  tvDB: DramaDB | null;
}

const TvVideo: React.FC<TvTrailerType> = ({ tv_id, tvDB }) => {
  const { data: tv, isLoading } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [currentPage, setCurrentPage] = useState("/trailers");
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/tv/${tv?.id}/videos${link}`);
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(imgRef.current);
      setDominantColor(`rgb(${color.join(",")})`); // Set the dominant color in RGB format
    }
  };

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      const extractColor = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(imgElement);
        if (color) {
          setDominantColor(`rgb(${color.join(",")})`);
        }
      };

      imgElement.addEventListener("load", extractColor);

      // Cleanup function to remove the event listener
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [tv]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full h-full ">
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-2 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            <LazyImage
              ref={imgRef} // Set the reference to the image
              src={`https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w500" : "w780"
              }/${tv?.poster_path || tv?.backdrop_path}`}
              alt={`${tv?.name || tv?.title}'s Poster`}
              width={200}
              height={200}
              quality={100}
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
              priority
              onLoad={extractColor}
            />
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {tv?.name} (
                {getYearFromDate(tv?.first_air_date || tv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv_id}`}
                className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="relative float-left w-full md:w-[25%] py-3 px-4 my-10">
          <div
            className="bg-white dark:bg-[#3a3b3c] border-t-[1px] border-t-[#dcdfe6] dark:border-[#242527] rounded-t-md px-4 py-2"
            style={{ backgroundColor: dominantColor as string | undefined }}
          >
            <div className="flex items-center justify-between text-white">
              <h1>Videos</h1>
              <VscQuestion />
            </div>
          </div>
          <ul className="border-b-[1px] border-b-[#dcdfe6] rounded-b-md shadow-md pt-3">
            {tvVideoList?.map((item, idx) => (
              <li
                key={idx}
                className={`pb-2 px-2 ${
                  currentPage === item?.link
                    ? "text-[#1675b6]"
                    : "text-black dark:text-white"
                }`}
              >
                <Link
                  href={`/tv/${tv?.id}/videos${item?.link}`}
                  className="text-md"
                  shallow
                  onClick={(e) => handleNavigation(e, item.link)}
                >
                  <span className="inline-block text-center mr-5 md:mr-3 lg:mr-5">
                    {item?.icon}
                  </span>
                  <span className="text-center md:text-sm lg:text-md">
                    {item?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {currentPage === "/trailers" ? (
          <TvTrailers tv_id={tv_id} tv={tv} />
        ) : currentPage === "/teasers" ? (
          <TvTeasers tv_id={tv_id} tv={tv} />
        ) : currentPage === "/clips" ? (
          <Clips tv_id={tv_id} tv={tv} />
        ) : currentPage === "/behind_the_scenes" ? (
          <BehindTheScenes tv_id={tv_id} tv={tv} />
        ) : currentPage === "/bloopers" ? (
          <Bloopers tv_id={tv_id} tv={tv} />
        ) : currentPage === "/featurettes" ? (
          <Featurettes tv_id={tv_id} tv={tv} />
        ) : currentPage === "/opening_credits" ? (
          <OpeningCredits tv_id={tv_id} tv={tv} />
        ) : (
          <TvTrailers tv_id={tv_id} tv={tv} />
        )}
      </div>
    </div>
  );
};

export default TvVideo;
