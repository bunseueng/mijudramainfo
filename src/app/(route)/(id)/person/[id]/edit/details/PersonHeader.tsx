"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";

interface PersonHeader {
  person_id: string;
  personDB: PersonDBType | any;
}

const PersonHeader: React.FC<PersonHeader> = ({ person_id, personDB }) => {
  const { data: person } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
  });
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // Reference for the image

  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.error || "Failed to get color");
    }

    return data.averageColor;
  };

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const color = await getColorFromImage(
        `https://image.tmdb.org/t/p/w45/${person?.profile_path}`
      );

      if (color) {
        // Use the color string directly
        setDominantColor(color);
      } else {
        console.error("No valid color returned");
      }
    }
  }, [person?.profile_path]);

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
