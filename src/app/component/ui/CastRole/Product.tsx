import { spaceToHyphen } from "@/lib/spaceToHyphen";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Product = ({ production, productionDB }: any) => {
  // Create a set to store unique director names
  const uniqueProducerNames = new Set();

  // Filter out producer with duplicate names
  const filteredProducer = production?.filter((producer: any) => {
    // Check if the producer's name is already in the set
    if (uniqueProducerNames.has(producer.name)) {
      // If it is, return false to filter out the producer
      return false;
    } else {
      // If it's not, add the name to the set and return true
      uniqueProducerNames.add(producer.name);
      return true;
    }
  });
  return (
    <div className="md:grid grid-cols-1 md:grid-cols-2 px-5">
      {productionDB?.length > 0
        ? productionDB?.map((item: any, idx: number) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-3"
              key={idx}
            >
              <div className="w-full h-full flex flex-row">
                <div className="box-content w-[90px]">
                  <Link
                    href={`/person/${item?.id}-${spaceToHyphen(item?.name)}`}
                    className="block outline-none box-content w-[110px] h-full"
                  >
                    {item.profile_path === null ? (
                      <Image
                        src="/default-pf.jpg"
                        alt={`${item?.name}'s Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-[90px] h-[120px] bg-cover object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                        alt={`${item?.name}'s Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-[90px] h-[120px] bg-cover object-cover rounded-md"
                      />
                    )}
                  </Link>
                </div>

                <div className="pl-2">
                  <Link
                    href={`/person/${item?.id}-${spaceToHyphen(item?.name)}`}
                    className="text-md font-bold truncate text-sky-700 dark:text-[#2196f3] cursor-pointer"
                  >
                    {item?.name}
                  </Link>
                  <h4 className="text-sm text-[#818a91]">
                    {item?.job || item?.jobs?.map((crew: any) => crew?.job)}
                  </h4>
                </div>
              </div>
            </div>
          ))
        : filteredProducer?.map((item: any, idx: number) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-3"
              key={idx}
            >
              <div className="w-full h-full flex flex-row">
                <div className="box-content w-[90px]">
                  <Link
                    href={`/person/${item?.id}-${spaceToHyphen(item?.name)}`}
                    className="block outline-none box-content w-[110px] h-full"
                  >
                    {item.profile_path === null ? (
                      <Image
                        src="/default-pf.jpg"
                        alt={`${item?.name}'s Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-[90px] h-[120px] bg-cover object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                        alt={`${item?.name}'s Profile`}
                        width={200}
                        height={200}
                        quality={100}
                        className="w-[90px] h-[120px] bg-cover object-cover rounded-md"
                      />
                    )}
                  </Link>
                </div>

                <div className="pl-2">
                  <Link
                    href={`/person/${item?.id}-${spaceToHyphen(item?.name)}`}
                    className="text-md font-bold truncate text-sky-700 dark:text-[#2196f3] cursor-pointer"
                  >
                    {item?.name}
                  </Link>
                  <h4 className="text-sm text-[#818a91]">
                    {item?.job || item?.jobs?.map((crew: any) => crew?.job)}
                  </h4>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Product;
