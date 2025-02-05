import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieMain from "./MovieMain";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { MovieDB } from "@/helper/type";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

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
  )}`;

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data?.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
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
