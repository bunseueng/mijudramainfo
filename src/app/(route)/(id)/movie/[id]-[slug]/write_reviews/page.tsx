import React from "react";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import WriteReview from "./WriteReview";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

export async function generateMetadata(
  props: {
    params: Promise<{ "id]-[slug": string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [movie_id] = params["id]-[slug"].split("-");
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const tvDetails = await response.json();
  const original_country = tvDetails?.origin_country?.[0];
  const getLanguage = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const language = await getLanguage.json();
  const matchedCountry = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );

  const countryToLanguageMap: { [key: string]: string } = {
    China: "Chinese",
    Korea: "Korean",
    Japan: "Japanese",
    Taiwan: "Taiwanese",
    Thai: "Thailand",
    // Add more mappings as needed
  };
  // Get the language name
  const languageName =
    countryToLanguageMap[matchedCountry?.english_name] ||
    matchedCountry?.english_name;

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Post_Review`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data?.name),
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/tv/${tvDetails?.id}`,
      title: tvDetails?.title,
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

const WriteMovieReviewPage = async (
  props: {
    params: Promise<{ "id]-[slug": string }>;
  }
) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [movie_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  return <WriteReview movie_id={movie_id} currentUser={currentUser} />;
};

export default WriteMovieReviewPage;
