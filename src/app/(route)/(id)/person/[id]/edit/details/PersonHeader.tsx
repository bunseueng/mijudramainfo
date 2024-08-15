"use client";

import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerson } from "@/app/actions/fetchMovieApi";
import { PersonDBType } from "@/helper/type";

interface PersonHeader {
  person_id: string;
  personDB: PersonDBType | null;
}

const PersonHeader: React.FC<PersonHeader> = ({ person_id, personDB }) => {
  const { data: person } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
  });
  return (
    <div className="bg-cyan-600">
      <div className="max-w-[1520px] flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center ">
          <Image
            src={
              personDB?.cover ||
              `https://image.tmdb.org/t/p/original/${person?.profile_path}`
            }
            alt="drama image"
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
