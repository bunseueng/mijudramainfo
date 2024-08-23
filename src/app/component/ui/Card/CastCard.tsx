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
                  <Link href={`/person/${item?.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                      alt="profile image"
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                ) : (
                  <Link href={`/person/${item?.id}`}>
                    <Image
                      src="/empty-pf.jpg"
                      alt="profile image"
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                )}
                <div className="flex flex-col items-start ml-2">
                  <Link
                    href={`/person/${item?.id}`}
                    className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
                  >
                    {item?.name}
                  </Link>
                  <h4 className="text-semibold text-sm md:text-md">
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
                  <Link href={`/person/${item?.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                      alt="profile image"
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                ) : (
                  <Link href={`/person/${item?.id}`}>
                    <Image
                      src="/empty-pf.jpg"
                      alt="profile image"
                      width={200}
                      height={200}
                      quality={100}
                      className="inline-block size-[90px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                    />
                  </Link>
                )}
                <div className="flex flex-col items-start ml-2">
                  <Link
                    href={`/person/${item?.id}`}
                    className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
                  >
                    {item?.name}
                  </Link>
                  <h4 className="text-semibold text-sm md:text-md">
                    {item?.character.length > 30
                      ? `${item?.character.substring(0, 25)}...`
                      : item?.character}
                  </h4>

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
