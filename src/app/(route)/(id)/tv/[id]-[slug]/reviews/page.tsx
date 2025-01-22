import React from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { CrewRole, DramaDB, ITvReview } from "@/helper/type";
import dynamic from "next/dynamic";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
import { getDramaData } from "@/app/actions/tvActions";
const Reviews = dynamic(() => import("./Reviews"));
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [tv_id] = params["id]-[slug"].split("-");
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
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
    title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Review`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data.name),
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/tv/${tvDetails?.id}`,
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
const ReviewsPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [tv_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  const { getDrama, getReview } = await getDramaData(tv_id, currentUser?.id);
  const formattedReviews: ITvReview[] = getReview.map((review) => ({
    ...review,
    review: review?.review as ITvReview["review"],
    rating_score: review.rating_score as ITvReview["rating_score"], // Assuming this JSON is structured correctly
    userInfo: review.userInfo as ITvReview["userInfo"], // Assuming this JSON is structured correctly
    overall_score: review.overall_score ? Number(review.overall_score) : 0, // Ensure it's a number
    reviewBy: review.reviewBy as ITvReview["reviewBy"], // Assuming this JSON is structured correctly
    updatedAt: review.updatedAt.toISOString(), // Convert Date to string if needed
    createdAt: review.createdAt, // Keep as Date
  }));
  return (
    <Reviews
      tv_id={tv_id}
      getDrama={getDrama as DramaDB | null}
      getReview={formattedReviews}
      currentUser={currentUser}
    />
  );
};

export default ReviewsPage;
