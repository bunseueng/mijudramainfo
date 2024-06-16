"use client";

import { fetchImages, fetchTv } from "@/app/actions/fetchMovieApi";
import PhotoLoading from "@/app/component/ui/Loading/PhotoLoading";
import { PaginationBtn } from "@/app/component/ui/Pagination/PaginationBtn";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getYearFromDate } from "../DramaMain";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

const PhotoAlbum = () => {
  const searchParams = useSearchParams();
  const pathParts =
    typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const tv_id = pathParts[2];

  const { data: getImage, isLoading } = useQuery({
    queryKey: ["getImage"],
    queryFn: () => fetchImages(tv_id),
  });
  const { data: getTv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });

  const [page, setPage] = useState(1);
  const currentBackdrops = getImage?.backdrops?.map((item: any) => item);
  const currentPosters = getImage?.posters?.map((item: any) => item);
  const combinedItems = currentPosters
    ?.concat(currentBackdrops)
    ?.reduce((acc: any, val: any) => acc.concat(val), []);

  // If there are fewer items than expected per page,
  // display all available items

  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalItems = combinedItems?.length;
  const currentItems = combinedItems?.slice(start, end) || combinedItems;

  if (isLoading) {
    return <PhotoLoading />;
  }

  return (
    <div>
      <div className="bg-cyan-600 dark:bg-[#242424]">
        <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center lg:items-start">
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                getTv?.poster_path || getTv?.backdrop_path
              }`}
              alt="Drama Image"
              width={50}
              height={50}
              quality={100}
              className="w-[90px] h-[130px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-5">
              <h1 className="text-white text-xl font-bold">
                {getTv?.name} (
                {getYearFromDate(getTv?.first_air_date || getTv?.release_date)})
              </h1>
              <Link
                href={`/tv/${tv_id}`}
                className="flex items-center my-5 opacity-75 cursor-pointer hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto md:py-8 md:px-10 mt-5 relative overflow-hidden">
        <div className="border-2 rounded-lg bg-white dark:bg-[#242424] dark:border-[#272727] px-2">
          <h1 className="w-full text-2xl font-bold p-5 border-b-2 border-b-slate-200 dark:text-[#2196f3] dark:border-[#2f2f2f]">
            {getTv?.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full h-full">
            {currentItems.map((img: any, idx: number) => (
              <div className="m-2 h-full" key={idx}>
                <div className="w-full h-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${img?.file_path}`}
                    alt="tvshow image"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <PaginationBtn totalItems={totalItems} setPage={setPage} />
      </div>
    </div>
  );
};

export default PhotoAlbum;
