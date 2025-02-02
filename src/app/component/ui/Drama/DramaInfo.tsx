import React from "react";
import Link from "next/link";
import {
  CrewRole,
  DramaDB,
  DramaDetails,
  DramaReleasedInfo,
  TVShow,
  TitleData,
} from "@/helper/type";
import { MobileInfo } from "./MobileInfo";

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
  matchedLanguage: any;
  formattedDates: any;
  content: any;
  rank: any;
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
  matchedLanguage,
  formattedDates,
  content,
  rank,
}) => {
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
          getDrama?.crew?.length > 0
            ? getDrama?.crew?.find(
                (crew: any) => crew?.department === "Directing"
              )?.name
            : director?.name?.length > 0
            ? director?.name
            : "Director is not yet added!"
        }
        textColor={textColor}
      />

      <InfoSection
        label="Screenwriter"
        value={
          getDrama?.crew?.length > 0
            ? getDrama?.crew?.find(
                (crew: any) =>
                  crew?.jobs && crew?.jobs[0]?.job === "Screenstory"
              )?.name
            : screenwriter?.name?.length > 0
            ? screenwriter?.name
            : "Screenwriter is not yet added!"
        }
        textColor={textColor}
      />

      <InfoSection
        label="Genres"
        value={
          getDrama?.genres_tags?.length > 0
            ? getDrama?.genres_tags
                ?.map((tag: any) =>
                  tag?.genre?.map((gen: any) => gen?.value).join(", ")
                )
                .join(", ")
            : tv?.genres?.length > 0
            ? tv?.genres?.map((genre: any) => genre.name).join(", ")
            : "Genres not yet added!"
        }
        textColor={textColor}
      />

      <InfoSection
        label="Tags"
        value={
          getDrama?.genres_tags?.length > 0
            ? formattedKeywordsDB
            : formattedKeywords?.length > 0
            ? formattedKeywords.join("")
            : "Tags is not yet added!"
        }
        textColor={textColor}
      />
      <div className="md:hidden">
        <MobileInfo
          detail={detail}
          tv={tv}
          textColor={textColor}
          info={info}
          matchedLanguage={matchedLanguage}
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
  value: string | undefined;
  textColor: string;
}> = ({ label, value, textColor }) => (
  <div className="mt-4">
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

export default DramaInfo;
