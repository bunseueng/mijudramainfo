import React from "react";

interface MobileInfoProps {
  detail: any;
  tv: any;
  info: any;
  textColor: string;
  matchedLanguage: any;
  formattedDates: {
    formattedFirstAirDate: string;
    formattedLastAirDate: string;
    formattedFirstAirDateDB: string;
    formattedLastAirDateDB: string;
  };
  content: any;
  rank: number;
}

export const MobileInfo: React.FC<MobileInfoProps> = ({
  detail,
  tv,
  info,
  textColor,
  matchedLanguage,
  formattedDates,
  content,
  rank,
}) => {
  const InfoRow = ({ label, value }: any) => (
    <div className="mt-4">
      <h1 className="text-white font-bold text-md" style={{ color: textColor }}>
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

  return (
    <>
      <InfoRow
        label="Country"
        value={detail?.title || matchedLanguage?.english_name}
      />

      <InfoRow
        label="Episode"
        value={info?.number_of_episodes || tv?.number_of_episodes}
      />

      <InfoRow
        label="Aired"
        value={
          formattedDates.formattedLastAirDate
            ? `${formattedDates.formattedFirstAirDate} - ${formattedDates.formattedLastAirDate}`
            : formattedDates.formattedFirstAirDate
        }
      />

      <InfoRow
        label="Airs On"
        value={
          info?.broadcast?.map((broad: any) => broad?.day)?.join(", ") || "?"
        }
      />

      <InfoRow
        label="Original Network"
        value={tv?.networks?.map((network: any) => network?.name)?.join(", ")}
      />

      <InfoRow
        label="Duration"
        value={`${detail?.duration || tv?.episode_run_time?.[0] || "?"} min.`}
      />

      <InfoRow
        label="Content Rating"
        value={
          detail?.content_rating ||
          (content?.results?.length === 0
            ? "Not Yet Rated"
            : `${content?.results[0]?.rating} + - Teens ${content?.results[0]?.rating} or older`)
        }
      />

      <InfoRow
        label="Status"
        value={
          detail?.status ||
          (tv?.status === "Returning Series" ? "Ongoing" : tv?.status)
        }
      />

      <InfoRow
        label="Score"
        value={`${tv?.vote_average?.toFixed(1)} ${
          tv?.vote_average === 0
            ? ""
            : `(scored by ${tv?.vote_count} ${
                tv?.vote_count < 2 ? " user" : " users"
              })`
        }`}
      />

      <InfoRow label="Ranked" value={`#${!rank ? "10000+" : rank}`} />

      <InfoRow label="Popularity" value={`#${tv?.popularity}`} />
    </>
  );
};
