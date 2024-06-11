import Image from "next/image";
import React from "react";

const TvPageLoading = () => {
  return (
    <div className="w-full h-full">
      <div className="relative overflow-hidden bg-cover bg-no-repeat h-auto">
        <div className="w-full flex flex-wrap h-full">
          <div className="flex flex-col md:flex-row content-center py-10 md:py-8 md:px-[100px]">
            <Image
              src="/black-img.jpg"
              alt="image"
              width={500}
              height={300}
              className="block align-middle w-[350px] h-[480px] rounded-lg pl-8 md:pl-0 animate-pulse duration-500"
            />
            <div className="px-8 py-5">
              <div className="mb-2 relative cursor-pointer hover:opacity-50 duration-300">
                <h2 className="text-3xl mb-3 font-bold text-white animate-pulse duration-500">
                  Loading...
                </h2>
              </div>
              <div className="mb-2 text-1xl font-bold text-white cursor-pointer hover:opacity-50 animate-pulse duration-500">
                Tags...
              </div>
              <div className="flex items-center py-5">
                <p className="text-white text-1xl font-bold uppercase animate-pulse duration-500">
                  Loading...
                </p>
              </div>
              <div className="flex items-center mt-2 mb-8">
                <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white animate-pulse duration-500"></p>
                <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white animate-pulse duration-500"></p>
                <p className="w-10 p-2 mr-5 rounded-full bg-cyan-600 text-white animate-pulse duration-500"></p>
                {/* Play Trailer Button  */}
              </div>
              <p className="mb-3 text-2xl mt-3">
                <span className="text-white font-bold animate-pulse duration-500">
                  Overview...
                </span>
              </p>
              <p className="text-lg text-white mb-3"></p>
              <div className="border-t-2 pt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Navtive Title...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
              <div className="mt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Also Known As...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
              <div className="mt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Director...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
              <div className="mt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Screenwriter...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
              <div className="mt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Genres...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
              <div className="mt-4">
                <h1 className="text-white font-bold text-md animate-pulse duration-500">
                  Tags...
                  <span className="text-sm pl-2 font-normal text-blue-300"></span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[97rem] mx-auto md:py-8 md:px-10 mt-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="w-full lg:w-[70%]">
            <div className="lg:w-[92%] flex items-center justify-between content-center px-2 lg:px-0">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold animate-pulse duration-500">
                  <span className="border border-l-yellow-500 border-l-4 rounded-md mr-4 animate-pulse duration-500"></span>
                  Cast & Credits...
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0"></div>
            <div className="border-b-2 border-b-slate-500 pb-5 mt-5 mx-2 md:mx-0"></div>
            <div className="py-5 mx-2 md:mx-0"></div>
          </div>
          <div className="w-full px-2 lg:w-[30%] my-5 md:my-0 lg:ml-5">
            <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full rounded-md">
              <h1 className="text-white text-2xl font-bold bg-cyan-600 p-4 rounded-t-md animate-pulse duration-500">
                Details...
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Drama...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Country...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Episode...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Aired...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Original Network...
                    <span className="font-semibold"></span>
                  </h1>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Duration...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Content Rating...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Status...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
              </div>
            </div>
            <div className="border border-slate-400 dark:border-[#272727] dark:bg-[#242424] h-full mt-5 rounded-md">
              <h1 className="text-white text-2xl font-bold bg-cyan-600 rounded-t-md p-4 animate-pulse duration-500">
                Statistics...
              </h1>
              <div className="flex flex-col p-4 pb-1">
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Score...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1">
                  <h1 className="text-lg font-bold pr-2 animate-pulse duration-500">
                    Ranked...
                  </h1>
                  <p className="font-semibold"></p>
                </div>
                <div className="flex items-center pb-1 animate-pulse duration-500">
                  <h1 className="text-lg font-bold pr-2">Popularity...</h1>
                  <p className="font-semibold"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvPageLoading;
