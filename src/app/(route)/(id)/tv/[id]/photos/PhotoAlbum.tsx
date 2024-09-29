"use client";

import { fetchImages, fetchTv } from "@/app/actions/fetchMovieApi";
import { PaginationBtn } from "@/app/component/ui/Pagination/PaginationBtn";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import dynamic from "next/dynamic";
import LazyImage from "@/components/ui/lazyimage";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

const PhotoAlbum = () => {
  const searchParams = useSearchParams();
  const pathParts =
    typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const tv_id = pathParts[2];

  const { data: getImage, isLoading } = useQuery({
    queryKey: ["getImage"],
    queryFn: () => fetchImages(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: getTv } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const [page, setPage] = useState(1);
  const currentBackdrops = getImage?.backdrops?.map((item: any) => item);
  const currentPosters = getImage?.posters?.map((item: any) => item);
  const combinedItems = currentPosters
    ?.concat(currentBackdrops)
    ?.reduce((acc: any, val: any) => acc.concat(val), []);
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalItems = combinedItems?.length;
  const currentItems = combinedItems?.slice(start, end) || combinedItems;

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief?.getColor(imgRef.current);
      setDominantColor(`rgb(${color.join(",")})`); // Set the dominant color in RGB format
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [getTv]);

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <div>
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-4 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            <LazyImage
              ref={imgRef} // Set the reference to the image
              src={`https://image.tmdb.org/t/p/${
                getTv?.poster_path ? "w154" : "w300"
              }/${getTv?.poster_path || getTv?.backdrop_path}`}
              alt={`${getTv?.name || getTv?.title}'s Poster`}
              width={60}
              height={90}
              quality={100}
              priority
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {getTv?.name} (
                {getYearFromDate(getTv?.first_air_date || getTv?.release_date)})
              </h1>
              <Link
                prefetch={true}
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
      <div className="relative max-w-6xl mx-auto md:py-8 mt-5 px-4 overflow-hidden">
        <div className="border-[1px] rounded-lg bg-white dark:bg-[#242424] dark:border-[#272727] px-2">
          <h1 className="w-full text-2xl font-bold p-5 border-b-[1px] border-b-slate-200 dark:text-[#2196f3] dark:border-[#2f2f2f]">
            {getTv?.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full h-full">
            {currentItems.map((img: any, idx: number) => (
              <div className="m-2 h-full" key={idx}>
                <div className="w-full h-full">
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/original/${img?.file_path}`}
                    alt={`${getTv?.name || getTv?.title}'s Poster/Backdrop`}
                    width={300}
                    height={300}
                    quality={100}
                    priority
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
