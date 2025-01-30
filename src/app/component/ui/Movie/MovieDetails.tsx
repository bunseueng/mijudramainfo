import React from "react";
import Link from "next/link";
import { formatDuration } from "@/app/actions/formattedDuration";
import {
  CrewRole,
  DramaDetails,
  MovieDB,
  MovieTitles,
  SpokenLanguage,
  TMDBMovie,
} from "@/helper/type";

interface MovieDetailsProps {
  getMovie: MovieDB | null;
  movie: TMDBMovie;
  detail: DramaDetails;
  textColor: string;
  director: CrewRole;
  screenwriter: CrewRole;
  genres: TMDBMovie[];
  title: MovieTitles[];
  formattedKeywords: string[];
  matchedLanguage: SpokenLanguage;
  formattedLastAirDate: string;
  formattedFirstAirDateDB: string;
  formattedLastAirDateDB: string;
  rank: number | null;
  formattedKeywordsDB: string | any;
}

const MovieDetails = ({
  getMovie,
  movie,
  detail,
  textColor,
  director,
  screenwriter,
  genres,
  title,
  formattedKeywords,
  matchedLanguage,
  formattedLastAirDate,
  formattedFirstAirDateDB,
  formattedLastAirDateDB,
  rank,
  formattedKeywordsDB,
}: MovieDetailsProps) => {
  return (
    <div>
      <p className="font-bold mb-3 text-2xl mt-3" style={{ color: textColor }}>
        Overview:
      </p>
      <p className="text-md mb-3" style={{ color: textColor }}>
        {detail?.synopsis
          ? detail?.synopsis
          : movie?.overview !== ""
          ? movie?.overview
          : `${movie?.name} has no overview yet!`}{" "}
        <Link
          href={`/movie/${movie?.id}/edit/detail`}
          className="text-sm text-[#2490da] break-words"
          shallow
          prefetch={false}
        >
          Edit Translation
        </Link>
      </p>

      <div className="border-t-[1px] pt-4">
        <h1 className="font-bold text-md" style={{ color: textColor }}>
          Native Title:
          <span className="text-sm pl-2 font-semibold">
            {detail?.native_title ||
              movie?.original_title ||
              "Native title is not yet added!"}
          </span>
        </h1>
      </div>

      <div className="mt-4">
        <h1
          className="text-white font-bold text-md"
          style={{ color: textColor }}
        >
          Also Known As:
          <span
            className="text-sm pl-2 font-semibold text-[#1675b6]"
            style={{ color: textColor }}
          >
            {detail?.known_as?.length > 0
              ? detail?.known_as?.map((known, idx) => (
                  <span key={idx}>
                    {idx > 0 && ", "}
                    {known}
                  </span>
                ))
              : title?.length > 0
              ? title?.map((title, index: number) => (
                  <span key={index}>
                    {index > 0 && ", "}
                    {title.title as any}
                  </span>
                ))
              : "Not yet added!"}
          </span>
        </h1>
      </div>

      {/* Additional movie details */}
      <div className="mt-4 space-y-4">
        <DetailRow
          label="Director"
          value={director?.name || "Director is not yet added!"}
          textColor={textColor}
        />
        <DetailRow
          label="Screenwriter"
          value={screenwriter?.name || "Screenwriter is not yet added!"}
          textColor={textColor}
        />
        <DetailRow
          label="Genres"
          value={
            genres?.map((g) => g.name).join(", ") || "Genres not yet added!"
          }
          textColor={textColor}
        />
        <DetailRow
          label="Tags"
          value={
            getMovie?.genres_tags && getMovie?.genres_tags?.length > 0
              ? formattedKeywordsDB
              : formattedKeywords?.length > 0
              ? formattedKeywords
              : "Tags is not yet added!"
          }
          textColor={textColor}
        />
        <DetailRow
          label="Country"
          value={matchedLanguage?.english_name || "Not specified"}
          textColor={textColor}
        />
        <DetailRow
          label="Aired"
          value={`${
            getMovie?.released_information &&
            getMovie?.released_information?.length > 0
              ? formattedLastAirDate
                ? `${formattedFirstAirDateDB} - ${formattedLastAirDateDB}`
                : formattedFirstAirDateDB
              : formattedLastAirDateDB
              ? movie?.release_date
              : movie?.release_date
          }`}
          textColor={textColor}
        />
        <DetailRow
          label="Duration"
          value={
            movie?.runtime
              ? formatDuration(movie.runtime)
              : "Duration not yet added."
          }
          textColor={textColor}
        />
        <DetailRow
          label="Status"
          value={
            movie?.status === "Returning Series" ? "Ongoing" : movie?.status
          }
          textColor={textColor}
        />
        <DetailRow
          label="Ranked"
          value={`#${!rank ? "10000+" : rank}`}
          textColor={textColor}
        />
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  textColor,
}: {
  label: string;
  value: string;
  textColor: string;
}) => (
  <div>
    <h1 className="font-bold text-md" style={{ color: textColor }}>
      {label}:
      <span
        className="text-sm pl-2 font-semibold text-[#1675b6]"
        style={{ color: textColor }}
      >
        {value}
      </span>
    </h1>
  </div>
);

export default MovieDetails;
