"use client";

import React, { useState } from "react";
import { RiComputerLine } from "react-icons/ri";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { IList } from "@/helper/type";
import dynamic from "next/dynamic";
const FetchRecentList = dynamic(() => import("./FetchRecentList"), {
  ssr: false,
});

const RecentLists: React.FC<IList> = ({ list }) => {
  const [hoveredIndexes, setHoveredIndexes] = useState<(number | null)[]>([]);

  const handleMouseEnter = (listIndex: number, index: number) => {
    setHoveredIndexes((prevState) => {
      const newState = [...prevState];
      newState[listIndex] = index;
      return newState;
    });
  };

  const handleMouseLeave = (listIndex: number) => {
    setHoveredIndexes((prevState) => {
      const newState = [...prevState];
      newState[listIndex] = null;
      return newState;
    });
  };

  return (
    <div className="mt-1">
      <div className="">
        {list?.map((listItem: any, listIndex: number) => (
          <div className="flex flex-col items-start" key={listIndex}>
            <div className="float-left w-[48.3333%] px-1 h-[108px]">
              <div className="h-[108px] relative mb-2 md:mb-10">
                <Link href={`/lists/${listItem?.listId}`}>
                  <ul className="flex h-[108px] float-left m-0 p-0">
                    {[...Array(5)].map((_, index) => {
                      const tvId = listItem.tvId[index];
                      const movieId = listItem.movieId[index];
                      return (
                        <div key={index}>
                          <FetchRecentList
                            tvId={tvId}
                            movieId={movieId}
                            index={index}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                            hoveredIndexes={hoveredIndexes}
                            listIndex={listIndex}
                          />
                        </div>
                      );
                    })}
                  </ul>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-start mb-5 md:mt-0 px-1">
              <h1 className="text-[#2490da] text-md font-bold">
                {listItem?.listTitle}
              </h1>
              <div className="flex items-center text-sm">
                <RiComputerLine />
                <span className="text-black dark:text-[#ffffff99] pl-2 pt-[1px]">
                  {listItem?.tvId?.length} titles
                </span>
                <CiHeart className="ml-3" size={20} />
                <span className="text-black dark:text-[#ffffff99] pl-1 pt-[1px]">
                  {listItem?.love} loves
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentLists;
