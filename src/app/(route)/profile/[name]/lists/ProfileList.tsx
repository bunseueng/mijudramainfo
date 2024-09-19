"use client";

import React, { useState } from "react";
import { RiComputerLine } from "react-icons/ri";
import Link from "next/link";
import { IList } from "@/helper/type";
import FetchList from "./FetchList";

const ProfileList: React.FC<IList> = ({ list }) => {
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
    <div className="mt-5">
      <h1 className="text-black dark:text-white text-xl md:text-2xl font-bold">
        My Lists
      </h1>
      <div className="my-5">
        <Link
          href="/lists/create"
          className="bg-white dark:bg-[#3e4042] border-2 dark:border-[#00000033] hover:bg-neutral-400 hover:bg-opacity-40 dark:hover:bg-opacity-40 px-4 py-2 rounded-md"
        >
          Create a new list
        </Link>
      </div>
      {list && list?.length > 0 ? (
        <div className="my-10">
          {list?.map((listItem: any, listIndex: number) => (
            <div
              className="flex flex-col md:flex-row items-start md:justify-between min-[1141px]:justify-start"
              key={listIndex}
            >
              <div className="float-left w-[48.3333%] px-1">
                <div className="h-[138px] relative mb-2 md:mb-10">
                  <Link href={`/lists/${listItem?.listId}`}>
                    <ul className="flex h-[138px] float-left m-0 p-0">
                      {[...Array(5)].map((_, index) => {
                        const tvId = listItem.tvId[index];
                        const movieId = listItem.movieId[index];
                        return (
                          <div key={index}>
                            <FetchList
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
              <div className="flex float-left flex-col items-start mb-5 md:mt-0">
                <h4 className="text-black dark:text-[#ffffff99] text-sm font-semibold mb-1">
                  {listItem?.privacy}
                </h4>
                <h1 className="text-[#2490da] text-md font-bold mb-1">
                  {listItem?.listTitle}
                </h1>
                <div className="flex items-center">
                  <RiComputerLine />
                  <span className="text-black dark:text-[#ffffff99] pl-2 pt-[1px]">
                    {listItem?.tvId?.length} titles
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          Lists not found. Create a new one?
        </div>
      )}
    </div>
  );
};

export default ProfileList;
