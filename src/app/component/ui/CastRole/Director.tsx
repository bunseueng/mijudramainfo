import Image from "next/image";
import Link from "next/link";
import React from "react";

const Director = ({ directors }: any) => {
  // Create a set to store unique director names
  const uniqueDirectorNames = new Set();

  // Filter out directors with duplicate names
  const filteredDirectors = directors.filter((director: any) => {
    // Check if the director's name is already in the set
    if (uniqueDirectorNames.has(director.name)) {
      // If it is, return false to filter out the director
      return false;
    } else {
      // If it's not, add the name to the set and return true
      uniqueDirectorNames.add(director.name);
      return true;
    }
  });

  return (
    <div className="md:grid grid-cols-1 md:grid-cols-2 px-5">
      {filteredDirectors.map((item: any) => (
        <div
          className="flex flex-col justify-between lg:flow-row items-start mt-8"
          key={item?.id}
        >
          <div className="w-full h-full flex flex-row">
            <Link href={`/person/${item?.id}`} className="cursor-pointer">
              {item.profile_path === null ? (
                <Image
                  src="/empty-pf.jpg"
                  alt="director image"
                  width={200}
                  height={200}
                  quality={100}
                  className="w-[110px] h-[130px] bg-center rounded-md border-2"
                />
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${item?.profile_path}`}
                  alt="director image"
                  width={200}
                  height={200}
                  quality={100}
                  className="w-[110px] h-[130px] bg-center rounded-md"
                />
              )}
            </Link>

            <div className="pl-2">
              <Link
                href={`/person/${item?.id}`}
                className="text-lg font-bold truncate text-sky-700 dark:text-[#2196f3]"
              >
                {item?.name}
              </Link>
              <h4 className="">
                {item?.job || item?.jobs?.map((crew: any) => crew?.job)}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Director;
