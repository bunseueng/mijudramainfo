import React from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import Link from "next/link";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface MovieHeaderProps {
  title: string;
  releaseDate: string;
  genres: [{ name: string; id: number }];
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

      {/* 🎯 Individual Genre Links */}
      <div className="mb-2 text-sm md:text-md font-bold">
        {genres.map((genre, index) => (
          <React.Fragment key={index}>
            <Link
              prefetch={false}
              href={`/genre/${genre?.id}-${spaceToHyphen(genre?.name)}/movie`}
              className="cursor-pointer hover:opacity-50 duration-300"
              style={{ color: textColor }}
            >
              {genre?.name}
            </Link>
            {/* Add a comma between genres except for the last one */}
            {index < genres.length - 1 && <span>, </span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MovieHeader;
