import React from "react";
import Link from "next/link";
import { formatDuration } from "@/app/actions/formattedDuration";
import {
  CrewRole,
  DramaDetails,
  DramaReleasedInfo,
  MovieDB,
  MovieTitles,
  RelatedTitle,
  SpokenLanguage,
  TMDBMovie,
} from "@/helper/type";
import { JsonValue } from "@prisma/client/runtime/library";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

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
  rank,
  formattedKeywordsDB,
}: MovieDetailsProps) => {
  const [info]: DramaReleasedInfo[] = (getMovie?.released_information ||
    []) as unknown as DramaReleasedInfo[];
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

      <div className="border-t-[1px] pt-2">
        <h1 className="font-bold text-md" style={{ color: textColor }}>
          Native Title:
          <span className="text-sm pl-2 font-semibold">
            {detail?.native_title ||
              movie?.original_title ||
              "Native title is not yet added!"}
          </span>
        </h1>
      </div>
      {getMovie?.related_title?.length &&
        getMovie?.related_title?.length > 0 && (
          <div className="mt-2">
            <h1
              className="text-white font-bold text-md"
              style={{ color: textColor }}
            >
              Related Content:
            </h1>
            {(getMovie?.related_title as unknown as RelatedTitle[])?.map(
              (data) => (
                <Link
                  prefetch={false}
                  aria-label="Visit this title page"
                  key={data?.id}
                  href={`/${data?.media_type === "tv" ? "tv" : "movie"}/${
                    data?.id
                  }-${spaceToHyphen(data?.name || data?.title)}`}
                  className="flex flex-wrap items-center"
                >
                  <span
                    className={`text-[${textColor}] hover:text-blue-300 transform duration-300 pr-1`}
                  >
                    {data?.name || data?.title}
                  </span>{" "}
                  <span className="text-sm">({data?.story})</span>
                </Link>
              )
            )}
          </div>
        )}

      <div className="mt-2">
        <h1 className={`text-[${textColor}] font-bold text-md`}>
          Also Known As:
          <span className={`text-sm pl-2 font-semibold text-[${textColor}]`}>
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
      <div className="mt-2 space-y-2">
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
            getMovie?.genres_tags?.length && getMovie?.genres_tags?.length > 0
              ? getMovie?.genres_tags
                  ?.map((tag: any) =>
                    tag?.genre?.map((gen: any) => gen?.value).join(", ")
                  )
                  .join(", ")
              : genres?.length > 0
              ? genres?.map((g) => g.name).join(", ")
              : "?"
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
          value={
            detail?.country || matchedLanguage?.english_name || "Not specified"
          }
          textColor={textColor}
        />
        <DetailRow
          label="Release Date"
          value={`${
            getMovie?.released_information &&
            getMovie?.released_information?.length > 0
              ? info.release_date
              : movie?.release_date
          }`}
          textColor={textColor}
        />
        <DetailRow
          label="Duration"
          value={
            detail?.duration || movie?.runtime
              ? formatDuration(movie.runtime)
              : "Duration not yet added."
          }
          textColor={textColor}
        />
        <DetailRow
          label="Status"
          value={
            detail?.status || movie?.status === "Returning Series"
              ? "Ongoing"
              : movie?.status
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
    <h1 className={`font-bold text-md text-[${textColor}]`}>
      {label}:
      <span className={`text-sm pl-2 font-semibold text-[${textColor}]`}>
        {value}
      </span>
    </h1>
  </div>
);

export default MovieDetails;
