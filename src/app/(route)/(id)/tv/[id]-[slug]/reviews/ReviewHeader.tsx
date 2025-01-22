import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

interface ReviewHeaderProps {
  tv: any;
  tv_id: string;
  dominantColor: string | null;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  tv,
  tv_id,
  dominantColor,
}) => {
  return (
    <div
      className="bg-cyan-600 dark:bg-[#242424]"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <div className="max-w-6xl mx-auto flex items-center mt-0 py-2">
        <div className="flex items-center lg:items-start px-4 md:px-6 cursor-default">
          {tv?.poster_path || tv?.backdrop_path !== null ? (
            <Image
              src={`https://image.tmdb.org/t/p/${
                tv?.poster_path ? "w154" : "w300"
              }/${tv?.poster_path || tv?.backdrop_path}`}
              alt={`${tv?.name || tv?.title}'s Poster`}
              width={60}
              height={90}
              quality={100}
              priority
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
            />
          ) : (
            <Image
              src="/placeholder-image.avif"
              alt={`${tv?.name || tv?.title}'s Poster`}
              width={60}
              height={90}
              quality={100}
              loading="lazy"
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
            />
          )}
          <div className="flex flex-col pl-5 py-2">
            <h1 className="text-white text-xl font-bold">
              {tv?.name} (
              {getYearFromDate(tv?.first_air_date || tv?.release_date)})
            </h1>
            <Link
              prefetch={false}
              href={`/tv/${tv_id}`}
              className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
            >
              <FaArrowLeft className="text-white" size={20} />
              <p className="text-white font-bold pl-2">Back to main</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;
