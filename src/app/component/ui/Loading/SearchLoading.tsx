import Image from "next/image";
import Link from "next/link";
import React from "react";

const SearchLoading = () => {
  return (
    <div className="flex flex-col items-start justify-start max-w-[1520px] mx-auto py-4 overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-[77.7777%] float-left px-1 md:px-4">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p></p>
          </div>
          <div className="h-full w-full p-2 overflow-hidden">
            {new Array(20).fill(0).map((_, idx) => {
              return (
                <div
                  className="grid grid-cols-1 bg-white dark:bg-[#242424] border-2 dark:border-[#272727] rounded-lg mb-4 animate-pulse duration-500"
                  key={idx}
                >
                  <div className="p-5 relative box-border h-[90%]">
                    <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                      <div className="relative">
                        <div className="block box-content">
                          <Image
                            src="/black-img.jpg"
                            alt="drama image"
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "100%" }}
                            priority
                            className="w-full object-cover align-middle overflow-clip"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="float-left w-[75%] md:w-[80%] px-3 align-top table-cell pl-1 md:pl-2">
                      <div className="flex items-center justify-between">
                        <div className="animate-pulse duration-500 w-52 h-5 bg-[#151515]"></div>
                      </div>
                      <p className="flex flex-wrap items-center py-1 opacity-70">
                        <span className="animate-pulse duration-500 w-24 h-5 bg-[#151515]"></span>
                        <span className="animate-pulse duration-500 w-52 h-5 bg-[#151515]"></span>
                      </p>
                      <div className="flex items-center">
                        <p className="animate-pulse duration-500 w-44 h-5 bg-[#151515]"></p>
                        <p className="animate-pulse duration-500 w-10 h-5 bg-[#151515]"></p>
                      </div>
                      <p className="animate-pulse duration-500 w-[100%] h-5 bg-[#151515] mt-3"></p>
                      <p className="animate-pulse duration-500 w-[100%] h-5 bg-[#151515] my-3"></p>
                      <p className="animate-pulse duration-500 w-[100%] h-5 bg-[#151515]"></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-[33.3333%] float-right">
          <div className="border rounded-lg border-slate-400 dark:border-[#272727]">
            <div className="px-10 py-5 bg-cyan-400 dark:bg-[#272727] rounded-t-lg">
              <h2 className="text-center font-bold uppercase text-white"></h2>
            </div>
            <div className="flex flex-col items-center dark:bg-[#151515]">
              <ul className="list w-full">
                <li className="py-2 relative nav text-start">
                  <div className="pl-2 pt-3">
                    <div className="flex items-center justify-between dark:text-white">
                      <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2"></div>
                    </div>
                  </div>
                </li>
                <li className="py-2 relative nav text-start">
                  <div className="pl-2 pt-3">
                    <div className="flex items-center justify-between dark:text-white">
                      <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2"></div>
                    </div>
                  </div>
                </li>
                <li className="py-2 relative nav text-start">
                  <div className="pl-2 pt-3">
                    <div className="flex items-center justify-between dark:text-white">
                      <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2"></div>
                    </div>
                  </div>
                </li>
                <li className="py-2 relative nav text-start">
                  <div className="pl-2 pt-3">
                    <div className="flex items-center justify-between dark:text-white">
                      <div className="bg-cyan-400 text-white text-sm border border-cyan-400 rounded-lg py-0 px-2 mx-2"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
