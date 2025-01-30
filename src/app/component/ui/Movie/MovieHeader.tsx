import React from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

interface MovieHeaderProps {
  title: string;
  releaseDate: string;
  genres: string[];
  textColor: string;
}

const MovieHeader = ({
  title,
  releaseDate,
  genres,
  textColor,
}: MovieHeaderProps) => {
  return (
    <div className="relative">
      <h2 className="text-3xl font-bold" style={{ color: textColor }}>
        <span className="cursor-pointer hover:opacity-50 duration-300">
          {title}
        </span>{" "}
        ({getYearFromDate(releaseDate)})
      </h2>
      <div className="mb-2 text-sm md:text-md font-bold">
        <span
          className="cursor-pointer hover:opacity-50 duration-300"
          style={{ color: textColor }}
        >
          {genres.join(", ")}
        </span>
      </div>
    </div>
  );
};

export default MovieHeader;
