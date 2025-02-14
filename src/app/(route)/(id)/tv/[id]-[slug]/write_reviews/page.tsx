import React from "react";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import WriteReview from "./WriteReview";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { getTVDetails } from "@/app/actions/tvActions";
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
  )}`;
  return {
    title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )}) Write Review`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
        tvDetails?.first_air_date || tvDetails?.release_date
      )}) Write Review`,
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

export const maxDuration = 60;

const WriteReviewPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [tv_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  return <WriteReview tv_id={tv_id} currentUser={currentUser} />;
};

export default WriteReviewPage;
