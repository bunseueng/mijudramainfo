import Image from "next/image";
import Link from "next/link";
import React from "react";

const CastCard = ({ getDrama, cast }: any) => {
  return (
    <>
      {getDrama?.cast?.length > 0
        ? getDrama?.cast?.slice(0, 6).map((item: any) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-8"
              key={item?.id}
            >
              <div className="flex flex-row items-center justify-between">
                {item?.profile_path !== null ? (
                  <Link prefetch={true} href={`/person/${item?.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                      alt={`${item?.name || item?.title}'s Profile`}
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                      priority
                    />
                  </Link>
                ) : (
                  <Link prefetch={true} href={`/person/${item?.id}`}>
                    <Image
                      src="/placeholder-image.avif"
                      alt={`${item?.name || item?.title}'s Profile`}
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                      priority
                    />
                  </Link>
                )}
                <div className="flex flex-col items-start ml-2">
                  <Link
                    prefetch={true}
                    href={`/person/${item?.id}`}
                    className="md:inline-block md:max-w-[145px] text-semibold text-sm md:text-md md:overflow-hidden md:whitespace-nowrap md:text-ellipsis truncate text-[#2196f3] hover:opacity-75 transform duraiton-300 font-bold"
                  >
                    {item?.name}
                  </Link>
                  <h4 className="text-semibold text-xs md:text-sm">
                    {item?.roles[0]?.character}
                  </h4>

                  <p className="text-xs text-[#818a91]">
                    {item?.order < 2 ? "Main Role" : "Support Role"}
                  </p>
                </div>
              </div>
            </div>
          ))
        : cast?.cast?.slice(0, 6).map((item: any) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-8"
              key={item?.id}
            >
              <div className="flex flex-row items-center justify-between">
                {item?.profile_path !== null ? (
                  <Link prefetch={true} href={`/person/${item?.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                      alt={`${item?.name || item?.title}'s Profile`}
                      width={200}
                      height={200}
                      quality={100}
                      priority
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                ) : (
                  <Link prefetch={true} href={`/person/${item?.id}`}>
                    <Image
                      src="/placeholder-image.avif"
                      alt={`${item?.name || item?.title}'s Profile`}
                      width={200}
                      height={200}
                      quality={100}
                      priority
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                )}
                <div className="flex flex-col items-start ml-2">
                  <Link
                    prefetch={true}
                    href={`/person/${item?.id}`}
                    className="md:inline-block md:max-w-[145px] text-semibold text-sm md:text-md md:overflow-hidden md:whitespace-nowrap md:text-ellipsis truncate text-[#2196f3] hover:opacity-75 transform duraiton-300 font-bold"
                  >
                    {item?.name}
                  </Link>
                  <p className="md:inline-block md:max-w-[145px] text-semibold text-xs md:text-sm md:overflow-hidden md:whitespace-nowrap md:text-ellipsis">
                    {item?.character}
                  </p>

                  <p className="text-xs text-[#818a91]">
                    {item?.order < 2 ? "Main Role" : "Support Role"}
                  </p>
                </div>
              </div>
            </div>
          ))}
    </>
  );
};

export default CastCard;
