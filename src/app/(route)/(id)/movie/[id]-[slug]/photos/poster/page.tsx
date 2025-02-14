import React from "react";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getDramaData, getTVDetails } from "@/app/actions/tvActions";
import { DramaDB, MovieDB } from "@/helper/type";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import MoviePoster from "./MoviePoster";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    return { title: "Movie Not Found" };
  }

  try {
    const [movie_id] = params["id]-[slug"].split("-");
    const movieDetails = await getMovieDetails(movie_id);
    const original_country = movieDetails?.origin_country?.[0];

    const countryToLanguageMap: { [key: string]: string } = {
      CN: "Chinese",
      KR: "Korean",
      JP: "Japanese",
      TW: "Taiwanese",
      TH: "Thai",
    };
    const languageName = countryToLanguageMap[original_country] || "Unknown";
    const title = `${
      movieDetails?.title
    } (${languageName} Drama ${getYearFromDate(
      movieDetails?.first_air_date || movieDetails?.release_date
    )}) Poster`;
    const url = `${process.env.BASE_URL}/tv/${movieDetails?.id}-${spaceToHyphen(
      movieDetails?.title
    )}/photos/poster`;
    return {
      title,
      description: movieDetails?.overview,
      keywords: movieDetails?.genres?.map((data: any) => data.name),
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "website",
        url: url,
        title: movieDetails?.name,
        description: movieDetails?.overview,
        siteName: "MijuDramaInfo",
        images: [
          {
            url: `https://image.tmdb.org/t/p/original/${movieDetails?.backdrop_path}`,
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
  const [movie_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const { getAllMovie } = await getMovieData(movie_id, user?.id);
  return (
    <MoviePoster
      movie_id={movie_id}
      getAllMovie={getAllMovie as MovieDB[] | []}
    />
  );
};

export default PhotosPage;
