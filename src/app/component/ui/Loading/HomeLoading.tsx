import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeLoading = () => {
  return (
    <div className="relative top-0 left-0 mt-5 overflow-hidden">
      <h1 className="text-3xl font-bold my-5"></h1>
      <div className="flex items-center w-full h-[300px] overflow-hidden overflow-x overflow-y-hidden whitespace-nowrap pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full h-full">
          {new Array(20).fill(0).map((_, idx) => {
            return (
              <div className="w-[200px] h-[280px] mr-8" key={idx}>
                <div className="w-[200px] h-[280px] bg-cover">
                  <div className="block hover:relative transform duration-100 group">
                    <div className="rounded-xl w-[200px] h-[250px] object-cover animate-pulse border-2 border-[#242424] bg-[#242424]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate"></p>
                    <p></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeLoading;
