import React from "react";
import MovieEditList from "../detail/MovieEditList";
import MovieEdit from "../detail/MovieEdit";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
import { getLanguages } from "@/app/actions/tvActions";

export const maxDuration = 60;
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
  const language = await getLanguages();
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

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Edit`,
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
const MovieServicesPage = async (props: {
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
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <MovieEdit movie_id={movie_id} />
      <MovieEditList movie_id={movie_id} movieDetails={getMovie} />
    </div>
  );
};

export default MovieServicesPage;
