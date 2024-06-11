import Image from "next/image";
import React from "react";

const ExploreLoading = () => {
  return (
    <div className="flex flex-col items-start justify-start max-w-[1520px] mx-auto py-4 px-4 md:px-6 overflow-hidden">
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

        <div className="w-full md:w-[33.33333%]">
          <div className="border bg-white dark:bg-[#242424] rounded-lg ml-4 lg:ml-10 animate-pulse duration-500">
            <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727] animate-pulse duration-500">
              Loading...
            </h1>

            <div className="">
              <div className="relative flex">
                <div className="w-[20%] md:ml-1 lg:ml-4 my-4 block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-1 lg:px-3 py-3 text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary" />
                <button
                  className="z-[2] rounded-e border-2 border-primary px-1 lg:px-6 my-4 md:mr-1 lg:mr-4 text-xs uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
                  type="submit"
                >
                  Search
                </button>
              </div>
              <div className="bg-cyan-100 dark:bg-[#1e1e1e] relative">
                <h1 className="text-lg font-bold p-4 animate-pulse duration-500">
                  Loading...
                </h1>
                <ul className="flex items-center">
                  <li className="bg-white dark:bg-[#242424] dark:text-[#2196f3] text-lg font-semibold border-t-2 border-x-2 rounded-t-md mx-4 px-2 cursor-pointer animate-pulse duration-500">
                    Loading...
                  </li>
                  <li className="bg-white dark:bg-[#242424] dark:text-[#2196f3] text-lg font-semibold border-t-2 border-x-2 rounded-t-md mx-4 px-2 animate-pulse duration-500">
                    Loading...
                  </li>
                </ul>
              </div>
              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>
              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Rating
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>

              <div className="border-b border-b-slate-300">
                <div className="p-4">
                  <b className="flex items-center justify-between cursor-pointer animate-pulse duration-500">
                    Loading...
                  </b>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-between p-4">
                  <button
                    type="submit"
                    className="px-4 py-2 border-2 animate-pulse duration-500"
                  >
                    Loading...
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border-2 animate-pulse duration-500"
                  >
                    Loading...
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreLoading;
