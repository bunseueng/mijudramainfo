"use client";

import { fetchImages, fetchTv } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import ColorThief from "colorthief";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const TvList = ({ tv_id }: any) => {
  const { data: tv, isLoading } = useQuery({
    queryKey: ["tv"],
    queryFn: () => fetchTv(tv_id),
  });
  const { data: image } = useQuery({
    queryKey: ["image"],
    queryFn: () => fetchImages(tv_id),
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<string>("Overview");
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleNavbarMouseEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(label);
  };
  const handleNavbarMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(null);
    }, 200);
  };

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
  }, [tv]);

  console.log(tv);

  return (
    <div
      className="border-b-[1px] border-b-[#ffffff] flex items-center justify-center shadow-md m-0 p-0 gap-0"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <Image
        ref={imgRef}
        onLoad={extractColor}
        src={`https://image.tmdb.org/t/p/original/${
          tv?.poster_path || tv?.backdrop_path
        }`}
        alt={`${tv?.name || tv?.title}'s Poster`}
        width={200}
        height={200}
        quality={100}
        className="w-[60px] h-[90px] bg-center object-center rounded-md hidden"
      />
      <ul className="relative inline-block m-0 p-0 z-50">
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-2 leading-[1px] -mb-[1px] ${
            currentItem === "Overview" && "border-b-[3px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Overview")}
          onMouseEnter={() => handleNavbarMouseEnter("Overview")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Overview{" "}
          <span className="inline-flex items-center justify-center ml-1">
            <IoIosArrowDown />
          </span>
        </li>{" "}
        {hovered === "Overview" && (
          <div
            className="absolute top-7 left-2 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Overview")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="py-2">
              <li className="text-sm text-muted-foreground hover:bg-[#f8f9fa] opacity-60 my-2 mx-6 cursor-text">
                Edit Information
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link
                  href={`/tv/${tv_id}/edit/detail`}
                  onClick={() => setCurrentItem("Overview")}
                >
                  Primary Details
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/cover`}>Cover Image</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/related`}>Related Titles</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/cast`}>Cast Credits</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/crew`}>Crew Credits</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/genres`}>Genres</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/genres`}>Tags</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/release`}>
                  Release Information
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/services`}>Services</Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/external_link`}>
                  External Links
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/production`}>
                  Production Information
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/edit/details`}>Report</Link>
              </li>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Media" && "border-b-[3px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Media")}
          onMouseEnter={() => handleNavbarMouseEnter("Media")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Media{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>
        {(hovered === "Media" || hovered === "Videos") && (
          <div
            className="absolute top-7 left-28 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Media")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="relative py-2">
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/media`}>
                  Backdrops{" "}
                  <span className="text-[#00000099] pl-2">
                    {image?.backdrops?.length}
                  </span>
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/media`}>
                  Logos{" "}
                  <span className="text-[#00000099] pl-2">
                    {image?.logos?.length}
                  </span>
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                <Link href={`/tv/${tv_id}/media`}>
                  Posters{" "}
                  <span className="text-[#00000099] pl-2">
                    {image?.posters?.length}
                  </span>
                </Link>
              </li>
              <div
                className="relative"
                onMouseEnter={() => handleNavbarMouseEnter("Videos")}
                onMouseLeave={handleNavbarMouseLeave}
              >
                <li
                  className={`text-sm font-semibold py-2 px-6 cursor-pointer ${
                    hovered === "Videos" && "bg-cyan-400"
                  }`}
                >
                  Videos{" "}
                  <span className="inline-block align-middle pl-2 pb-1">
                    <IoIosArrowForward />
                  </span>
                </li>
                {hovered === "Videos" && (
                  <div className="w-[200px] absolute -top-10 left-full bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2">
                    <ul className="py-2">
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Trailers
                      </li>{" "}
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Behind The Scenes
                      </li>{" "}
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Featurettes
                      </li>{" "}
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Teasers
                      </li>{" "}
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Opening Credits
                      </li>{" "}
                      <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                        Clips
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Fandom" && "border-b-[3px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Fandom")}
          onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Fandom{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>{" "}
        {hovered === "Fandom" && (
          <div
            className="absolute top-7 right-24 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="py-2">
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                Discuss
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                Reviews
              </li>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-1 ${
            currentItem === "Share" && "border-b-[3px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Share")}
          onMouseEnter={() => handleNavbarMouseEnter("Share")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Share{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>
        {hovered === "Share" && (
          <div
            className="absolute top-7 right-4 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Share")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="py-2">
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                Share Links
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                Facebook
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] font-semibold py-1 px-6 cursor-pointer">
                Tweet
              </li>
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

export default TvList;
