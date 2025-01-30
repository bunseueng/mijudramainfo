import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieMain from "./MovieMain";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { getLanguages } from "@/app/actions/tvActions";
import { MovieDB } from "@/helper/type";

export const revalidate = 3600;

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
    )})`,
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

export default async function tvPage(props: {
  params: Promise<{ "id]-[slug": string }>;
}) {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    notFound();
  }

  const [movie_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const movieData = await getMovieData(movie_id, user?.id);

  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={movie_id} fallback={<SearchLoading />}>
      <MovieMain
        movie_id={movie_id}
        user={user}
        getMovie={movieData.getMovie as MovieDB | null}
        users={movieData.users}
        getComment={movieData.getComment}
        lists={movieData.lists}
        existedFavorite={movieData.existedFavorite}
        existedWatchlist={movieData.existedWatchlist}
        existingRatings={movieData.existingRatings}
        getReview={movieData.getReview}
        userRating={movieData.userRating}
      />
    </Suspense>
  );
}
