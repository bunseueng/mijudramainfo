import React from "react";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getDramaData, getTVDetails } from "@/app/actions/tvActions";
import { DramaDB } from "@/helper/type";
import TvPoster from "./TvPoster";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    return { title: "TV Drama Not Found" };
  }

  try {
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
    const title = `Posters of ${
      tvDetails?.name
    } (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`;
    const url = `${process.env.BASE_URL}/tv/${tvDetails?.id}-${spaceToHyphen(
      tvDetails?.name
    )}/photos/poster`;
    return {
      title,
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
        siteName: "MijuDramaInfo",
        images: [
          {
            url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "There was an error loading the TV drama information.",
    };
  }
}
const PhotosPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [tv_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const { getAllDrama } = await getDramaData(tv_id, user?.id);
  return <TvPoster tv_id={tv_id} getDrama={getAllDrama as DramaDB[] | []} />;
};

export default PhotosPage;
