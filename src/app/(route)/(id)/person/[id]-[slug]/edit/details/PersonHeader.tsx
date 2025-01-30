"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PersonDBType } from "@/helper/type";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { usePersonData } from "@/hooks/usePersonData";

interface PersonHeader {
  person_id: string;
  personDB: PersonDBType | any;
}

const PersonHeader: React.FC<PersonHeader> = ({ person_id, personDB }) => {
  const { person, isLoading } = usePersonData(person_id);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image
  const getColorFromImage = useColorFromImage();

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl =
        (personDB?.cover as string) ||
        `https://image.tmdb.org/t/p/w185/${person?.profile_path}`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const rgbaColor = `rgb(${r}, ${g}, ${b})`; // Full opacity
      setDominantColor(rgbaColor);
    } else {
      console.error("Image url undefined");
    }
  }, [personDB?.cover, person?.profile_path, getColorFromImage]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current; // Store the current value in a local variable
      imgElement.addEventListener("load", extractColor);

      // Cleanup function
      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [extractColor]);

  if (isLoading) {
    return <div>Fetching Data...</div>;
  }

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
            <h1 className="text-white text-xl font-bold">{person?.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonHeader;
