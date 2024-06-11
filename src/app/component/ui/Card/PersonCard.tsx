import Image from "next/image";
import React from "react";

const PersonCard = ({ item }: any) => {
  return (
    <>
      <div className="flex flex-col items-center mx-5">
        <Image
          src={`https://image.tmdb.org/t/p/original/${item.profile_path}`}
          alt="profile image"
          width={50}
          height={50}
          quality={100}
          className="inline-block size-[100px] object-cover rounded-full"
        />
        <div className="flex flex-col items-center">
          <h1 className="text-sm md:text-xl font-bold truncate dark:text-white">
            {item?.name}
          </h1>
          <h4 className="text-sm md:text-lg text-center overflow-hidden">
            {item?.character}
          </h4>
          <p>{item?.order < 2 ? "Main Role" : "Support Role"}</p>
        </div>
      </div>
    </>
  );
};

export default PersonCard;
