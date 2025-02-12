"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { PiShareNetworkBold } from "react-icons/pi";
import { RxLink1 } from "react-icons/rx";
import { useColorFromImage } from "@/hooks/useColorFromImage";

export const NetworkHeader = ({ networksDetail }: any) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const getColorFromImage = useColorFromImage();

  useEffect(() => {
    const extractColor = async () => {
      if (imgRef.current) {
        const imageUrl = `https://image.tmdb.org/t/p/w92/${networksDetail?.logo_path}`;
        const [r, g, b] = await getColorFromImage(imageUrl);
        const color = `rgb(${r}, ${g}, ${b})`;
        setDominantColor(color);
      }
    };

    if (imgRef.current) {
      const imgElement = imgRef.current;
      imgElement.addEventListener("load", extractColor);
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [networksDetail?.logo_path, getColorFromImage]);

  return (
    <div
      className="bg-cyan-600"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <div className="max-w-[1520px] mx-auto py-4 px-4 md:px-6">
        <div className="w-full bg-white bg-opacity-50 p-2">
          <Image
            ref={imgRef}
            src={`https://image.tmdb.org/t/p/w300/${networksDetail?.logo_path}`}
            alt={`${networksDetail?.name}'s Logo`}
            width={300}
            height={200}
            quality={100}
            priority
            className="w-[300px] bg-center bg-cover object-cover rounded-md"
          />
        </div>
        <div className="w-full flex items-center">
          <div className="mt-5">
            <ul className="flex items-center font-bold bg-white text-black p-2 rounded-md">
              <li className="flex items-center text-xs md:text-base px-2">
                <PiShareNetworkBold className="mr-1" /> {networksDetail?.name}
              </li>
              <li className="flex items-center text-xs md:text-base px-2">
                <CiLocationOn className="mr-1" /> {networksDetail?.headquarters}
              </li>
              <li className="flex items-center text-xs md:text-base px-2">
                <BsGlobeAsiaAustralia className="mr-1" />
                {networksDetail?.origin_country}
              </li>
              <li className="flex items-center text-xs md:text-base px-2">
                <RxLink1 className="mr-1" />{" "}
                <Link prefetch={false} href={`${networksDetail?.homepage}`}>
                  Homepage
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
