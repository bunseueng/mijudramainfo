import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { IMovieReview } from "@/helper/type";
import MovieReview from "./MovieReview";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
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
  )}/reviews`;

  return {
    title: `${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )}) | Reviews`,
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
      )}) | Reviews`,
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
const MovieReviewsPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [movie_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  const { getMovie, getReview } = await getMovieData(movie_id, currentUser?.id);
  const formattedReviews: IMovieReview[] | any = getReview.map((review) => ({
    ...review,
    review: review?.review as IMovieReview["review"],
    rating_score: review.rating_score as IMovieReview["rating_score"], // Assuming this JSON is structured correctly
    userInfo: review.userInfo as IMovieReview["userInfo"], // Assuming this JSON is structured correctly
    overall_score: review.overall_score ? Number(review.overall_score) : 0, // Ensure it's a number
    reviewBy: review.reviewBy as IMovieReview["reviewBy"], // Assuming this JSON is structured correctly
    updatedAt: review.updatedAt.toISOString(), // Convert Date to string if needed
    createdAt: review.createdAt, // Keep as Date
  }));
  return (
    <MovieReview
      movie_id={movie_id}
      getMovie={getMovie}
      getReview={formattedReviews}
      currentUser={currentUser}
    />
  );
};

export default MovieReviewsPage;
