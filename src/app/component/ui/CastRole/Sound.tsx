import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sound = ({ sound, soundDB }: any) => {
  // Create a set to store unique director names
  const uniqueSoundNames = new Set();

  // Filter out sound with duplicate names
  const filteredSound = sound?.filter((sound: any) => {
    // Check if the sound's name is already in the set
    if (uniqueSoundNames.has(sound.name)) {
      // If it is, return false to filter out the sound
      return false;
    } else {
      // If it's not, add the name to the set and return true
      uniqueSoundNames.add(sound.name);
      return true;
    }
  });

  console.log(sound);
  return (
    <div className="md:grid grid-cols-1 md:grid-cols-2 px-5">
      {soundDB?.length > 0
        ? soundDB?.map((item: any, idx: number) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-3"
              key={idx}
            >
              <div className="w-full h-full flex flex-row">
                <div className="box-content w-[90px]">
                  <Link
                    href={`/person/${item?.id}`}
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
                    href={`/person/${item?.id}`}
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
        : filteredSound?.map((item: any, idx: number) => (
            <div
              className="flex flex-col justify-between lg:flow-row items-start mt-3"
              key={idx}
            >
              <div className="w-full h-full flex flex-row">
                <div className="box-content w-[90px]">
                  <Link
                    href={`/person/${item?.id}`}
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
                    href={`/person/${item?.id}`}
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

export default Sound;
