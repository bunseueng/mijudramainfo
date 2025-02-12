"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  CrewRole,
  DramaDB,
  DramaDetails,
  DramaReleasedInfo,
  TVShow,
  TitleData,
} from "@/helper/type";
import { MobileInfo } from "./MobileInfo";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface DramaInfoProps {
  detail: DramaDetails;
  title: TitleData[];
  tv: TVShow;
  textColor: string;
  getDrama: DramaDB;
  director: CrewRole;
  screenwriter: CrewRole;
  formattedKeywordsDB: string;
  formattedKeywords: string[];
  info: DramaReleasedInfo;
  formattedDates: any;
  content: any;
  rank: any;
  keyword: any;
}

const DramaInfo: React.FC<DramaInfoProps> = ({
  detail,
  title,
  tv,
  textColor,
  getDrama,
  director,
  screenwriter,
  formattedKeywordsDB,
  formattedKeywords,
  info,
  formattedDates,
  content,
  rank,
  keyword,
}) => {
  const [hoveredItem, setHoveredItem] = useState<{
    type: string;
    id: number | null;
  }>({ type: "", id: null });
  const director_db = getDrama?.crew?.find(
    (crew: any) => crew?.department === "Directing"
  );
  const writer = getDrama?.crew?.find(
    (crew: any) => crew?.jobs && crew?.jobs[0]?.job === "Screenstory"
  );
  return (
    <div className="drama-info">
      <p className="font-bold mb-3 text-2xl mt-3" style={{ color: textColor }}>
        Overview:
      </p>
      <p className="text-md mb-3 border-b pb-4" style={{ color: textColor }}>
        {detail?.synopsis
          ? detail?.synopsis
          : tv?.overview !== ""
          ? tv?.overview
          : `${tv?.name} has no overview yet!`}{" "}
        <span>
          <Link
            prefetch={false}
            href={`/tv/${tv?.id}/edit/detail`}
            className="text-sm text-[#2490da] break-words"
            shallow
          >
            Edit Translation
          </Link>
        </span>
      </p>

      <InfoSection
        label="Native Title"
        value={
          detail?.native_title
            ? detail?.native_title
            : tv?.original_name?.length > 0
            ? tv?.original_name
            : "Native title is not yet added!"
        }
        textColor={textColor}
      />

      <InfoSection
        label="Also Known As"
        value={
          detail?.known_as?.length > 0
            ? detail?.known_as?.map((known, idx) => (
                <span key={idx}>
                  {idx > 0 && ", "}
                  {known}
                </span>
              ))
            : title?.length > 0
            ? title?.map((title: any, index: number) => (
                <span key={index}>
                  {index > 0 && ", "}
                  {title?.title}
                </span>
              ))
            : ("Not yet added!" as any)
        }
        textColor={textColor}
      />

      <InfoSection
        label="Director"
        value={
          <Link
            prefetch={false}
            href={
              getDrama?.crew?.length > 0 || director?.name?.length > 0
                ? `/person/${director_db?.id || director?.id}-${
                    director_db?.name || director?.name
                  }`
                : "#"
            }
            onMouseEnter={() => setHoveredItem({ type: "director", id: null })}
            onMouseLeave={() => setHoveredItem({ type: "", id: null })}
            style={{
              color: hoveredItem.type === "director" ? "#2490da" : textColor,
            }}
          >
            {getDrama?.crew?.length > 0
              ? director_db?.name
              : director?.name?.length > 0
              ? director?.name
              : "Director is not yet added!"}
          </Link>
        }
        textColor={textColor}
      />

      <InfoSection
        label="Screenwriter"
        value={
          <Link
            prefetch={false}
            href={
              getDrama?.crew?.length > 0 || screenwriter?.name?.length > 0
                ? `/person/${writer?.id || screenwriter?.id}-${
                    writer?.name || screenwriter?.name
                  }`
                : "#"
            }
            onMouseEnter={() => setHoveredItem({ type: "writer", id: null })}
            onMouseLeave={() => setHoveredItem({ type: "", id: null })}
            style={{
              color: hoveredItem.type === "writer" ? "#2490da" : textColor,
            }}
          >
            {getDrama?.crew?.length > 0
              ? writer?.name
              : screenwriter?.name?.length > 0
              ? screenwriter?.name
              : "Screenwriter is not yet added!"}
          </Link>
        }
        textColor={textColor}
      />

      <InfoSection
        label="Genres"
        value={
          getDrama?.genres_tags?.length > 0
            ? getDrama.genres_tags.flatMap((tag: any, tagIndex: number) =>
                tag?.genre?.map((gen: any, genIndex: number) => (
                  <React.Fragment key={gen?.id}>
                    <Link
                      href={`/genre/${gen?.id}-${spaceToHyphen(gen?.value)}/tv`}
                      prefetch={false}
                      onMouseEnter={() =>
                        setHoveredItem({ type: "genre", id: gen?.id })
                      }
                      onMouseLeave={() =>
                        setHoveredItem({ type: "", id: null })
                      }
                      style={{
                        color:
                          hoveredItem.type === "genre" &&
                          hoveredItem.id === gen?.id
                            ? "#2490da"
                            : textColor,
                      }}
                    >
                      {gen?.value}
                    </Link>
                    {genIndex < tag.genre.length - 1 ||
                    tagIndex < getDrama.genres_tags.length - 1
                      ? ", "
                      : ""}
                  </React.Fragment>
                ))
              )
            : tv?.genres?.length > 0
            ? tv.genres.map((genre: any, index: number) => (
                <React.Fragment key={genre?.id}>
                  <Link
                    href={`/genre/${genre?.id}-${spaceToHyphen(
                      genre?.name
                    )}/tv`}
                    prefetch={false}
                    onMouseEnter={() =>
                      setHoveredItem({ type: "genre", id: genre?.id })
                    }
                    onMouseLeave={() => setHoveredItem({ type: "", id: null })}
                    style={{
                      color:
                        hoveredItem.type === "genre" &&
                        hoveredItem.id === genre?.id
                          ? "#2490da"
                          : textColor,
                    }}
                  >
                    {genre.name}
                  </Link>
                  {index < tv.genres.length - 1 ? ", " : ""}
                </React.Fragment>
              ))
            : "?"
        }
        textColor={textColor}
      />

      <InfoSection
        label="Tags"
        value={keyword?.map(
          (key: { name: string; id: number }, index: number) => {
            const capitalizedKeyword =
              key.name.charAt(0).toUpperCase() + key.name.slice(1);
            return (
              <span key={key?.id}>
                <Link
                  href={`/keyword/${key?.id}/tv`}
                  prefetch={false}
                  onMouseEnter={() =>
                    setHoveredItem({ type: "tag", id: key?.id })
                  }
                  onMouseLeave={() => setHoveredItem({ type: "", id: null })}
                  style={{
                    color:
                      hoveredItem.type === "tag" && hoveredItem.id === key?.id
                        ? "#2490da"
                        : textColor,
                  }}
                >
                  {getDrama?.genres_tags?.length > 0
                    ? formattedKeywordsDB
                    : formattedKeywords?.length > 0
                    ? capitalizedKeyword
                    : "?"}
                </Link>
                {index < keyword.length - 1 && ", "}
              </span>
            );
          }
        )}
        textColor={textColor}
      />
      <div className="md:hidden">
        <MobileInfo
          detail={detail}
          tv={tv}
          textColor={textColor}
          info={info}
          formattedDates={formattedDates}
          content={content}
          rank={rank}
          getDrama={getDrama}
        />
      </div>
    </div>
  );
};

const InfoSection: React.FC<{
  label: string;
  value: React.ReactNode;
  textColor: string;
}> = ({ label, value, textColor }) => (
  <div className="mt-4">
    <h1 className={`font-bold text-md`} style={{ color: textColor }}>
      {label}:
      <span
        className={`text-sm pl-2 font-semibold transform duration-300 cursor-pointer`}
        style={{ color: textColor }}
      >
        {value}
      </span>
    </h1>
  </div>
);

export default DramaInfo;
