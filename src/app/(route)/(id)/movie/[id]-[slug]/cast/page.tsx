import React from "react";
import AllMovieCast from "./AllMovieCast";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [movie_id] = params["id]-[slug"].split("-");
  const tvDetails = await getMovieDetails(movie_id);
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
    tvDetails?.title
  )}/cast`;

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )}) | Full Cast & Crew`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data?.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
        tvDetails?.first_air_date || tvDetails?.release_date
      )}) | Full Cast & Crew`,
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

const AllMovieCastPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [movie_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const { getMovie } = await getMovieData(movie_id, user?.id);
  return (
    <div>
      <AllMovieCast movie_id={movie_id} getMovie={getMovie} />
    </div>
  );
};

export default AllMovieCastPage;
