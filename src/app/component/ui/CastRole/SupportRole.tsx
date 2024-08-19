import Image from "next/image";
import Link from "next/link";
import React from "react";

const SupportRole = ({ cast, getDrama }: any) => {
  return (
    <div className="md:grid grid-cols-1 md:grid-cols-2 px-5">
      {getDrama?.length > 0
        ? getDrama?.cast
            ?.filter(
              (cast: any) =>
                !cast?.order ||
                (cast?.order > 2 && cast?.total_episode_count > 5)
            )
            .map((item: any) => (
              <div
                className="flex flex-col justify-between lg:flow-row items-start mt-8"
                key={item?.id}
              >
                <div className="w-full h-full flex flex-row">
                  <div className="box-content w-[110px]">
                    <Link
                      href={`/person/${item?.id}`}
                      className="block outline-none box-content w-[110px] h-full"
                    >
                      {item.profile_path === null ? (
                        <Image
                          src="/empty-pf.jpg"
                          alt="Support role profile"
                          width={200}
                          height={200}
                          quality={100}
                          className="w-[110px] h-[130px] bg-center rounded-md border-2 border-slate-400"
                        />
                      ) : (
                        <Image
                          src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                          alt="Support role profile"
                          width={200}
                          height={200}
                          quality={100}
                          className="w-[110px] h-[130px] bg-center rounded-md"
                        />
                      )}
                    </Link>
                  </div>
                  <div className="flex flex-col items-start ml-2 w-full">
                    <Link
                      href={`/person/${item?.id}`}
                      className="text-md font-bold truncate text-sky-700 dark:text-[#2196f3] cursor-pointer"
                    >
                      {item?.name}
                    </Link>
                    <h4 className="text-sm text-semibold text-black dark:text-white">
                      {item?.roles?.map((role: any) => role?.character) ||
                        item?.character}
                    </h4>

                    <p className="text-xs dark:text-[#818a91]">
                      {item?.cast_role || item?.order < 2
                        ? "Main Role"
                        : "Support Role"}
                    </p>
                  </div>
                </div>
              </div>
            ))
        : cast?.cast
            ?.filter(
              (cast: any) => cast?.order > 2 && cast?.total_episode_count > 5
            )
            .map((item: any) => (
              <div
                className="flex flex-col justify-between lg:flow-row items-start mt-8"
                key={item?.id}
              >
                <div className="w-full h-full flex flex-row">
                  <div className="box-content w-[110px]">
                    <Link
                      href={`/person/${item?.id}`}
                      className="block outline-none box-content w-[110px] h-full"
                    >
                      {item.profile_path === null ? (
                        <Image
                          src="/empty-pf.jpg"
                          alt="Support role profile"
                          width={200}
                          height={200}
                          quality={100}
                          className="w-[110px] h-[130px] bg-center rounded-md border-2 border-slate-400"
                        />
                      ) : (
                        <Image
                          src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                          alt="Support role profile"
                          width={200}
                          height={200}
                          quality={100}
                          className="w-[110px] h-[130px] bg-center rounded-md"
                        />
                      )}
                    </Link>
                  </div>
                  <div className="flex flex-col items-start ml-2 w-full">
                    <Link
                      href={`/person/${item?.id}`}
                      className="text-md font-bold truncate text-sky-700 dark:text-[#2196f3] cursor-pointer"
                    >
                      {item?.name}
                    </Link>
                    <h4 className="text-sm text-semibold text-black dark:text-white">
                      {item?.roles?.map((role: any) => role?.character) ||
                        item?.character}
                    </h4>

                    <p className="text-xs dark:text-[#818a91]">
                      {item?.order < 2 ? "Main Role" : "Support Role"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
    </div>
  );
};

export default SupportRole;
