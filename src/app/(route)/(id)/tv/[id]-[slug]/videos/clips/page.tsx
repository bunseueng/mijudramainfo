import React from "react";
import TvVideo from "../TvVideo";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getDramaData, getTVDetails } from "@/app/actions/tvActions";
import { DramaDB } from "@/helper/type";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [tv_id] = params["id]-[slug"].split("-");
  const tvDetails = await getTVDetails(tv_id);
  const original_country = tvDetails?.origin_country?.[0];
  const countryToLanguageMap: { [key: string]: string } = {
    CN: "Chinese",
    KR: "Korean",
    JP: "Japanese",
    TW: "Taiwanese",
    TH: "Thai",
  };
  const languageName = countryToLanguageMap[original_country] || "Unknown";
  const url = `${process.env.BASE_URL}/tv/${tvDetails?.id}-${spaceToHyphen(
    tvDetails?.name
  )}/videos/clips`;
  return {
    title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Clips`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: tvDetails?.name,
      description: tvDetails?.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
const ClipsPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [tv_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  const { getDrama, getAllDrama } = await getDramaData(tv_id, currentUser?.id);
  return (
    <TvVideo
      tv_id={tv_id}
      tvDB={getDrama as DramaDB | null}
      getDrama={getAllDrama as DramaDB[] | []}
    />
  );
};

export default ClipsPage;
