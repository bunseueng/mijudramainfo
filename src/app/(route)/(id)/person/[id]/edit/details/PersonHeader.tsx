"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";
import ColorThief from "colorthief";

interface PersonHeader {
  person_id: string;
  personDB: PersonDBType | null;
}

const PersonHeader: React.FC<PersonHeader> = ({ person_id, personDB }) => {
  const { data: person } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
  });
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const extractColor = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(imgRef.current);
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
  }, [person]);

  return (
    <div
      className="bg-cyan-600"
      style={{ backgroundColor: dominantColor as string | undefined }}
    >
      <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center ">
          <Image
            ref={imgRef} // Set the reference to the image
            src={
              personDB?.cover ||
              `https://image.tmdb.org/t/p/original/${person?.profile_path}`
            }
            alt={`${person?.name || person?.title}'s Profile`}
            width={200}
            height={200}
            quality={100}
            className="w-[60px] h-[70px] bg-center bg-cover object-cover rounded-md"
          />
          <div className="flex flex-col pl-5 py-3">
            <h1 className="text-white text-4xl font-bold">{person?.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonHeader;
