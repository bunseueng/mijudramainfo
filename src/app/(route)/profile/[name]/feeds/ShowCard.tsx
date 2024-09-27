import LazyImage from "@/components/ui/lazyimage";
import React from "react";

const ShowCard = ({ show }: any) => {
  return (
    <div className="dark:bg-[#232425] rounded-sm my-2 mx-3">
      <div className="flex p-3">
        <LazyImage
          src={`https://image.tmdb.org/t/p/${
            show?.poster_path ? "w154" : "w300"
          }/${show?.poster_path || show?.backdrop_path}`}
          alt={show?.name}
          width={150}
          height={150}
          quality={100}
          priority
          className="block w-[80px] h-[100px] bg-cover object-cover leading-10 align-middle pointer-events-none"
        />
        <p className="text-[#1675b6] text-lg font-bold p-2">{show?.name}</p>
      </div>
    </div>
  );
};

export default ShowCard;
