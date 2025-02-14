import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { DramaDB, ITvReview } from "@/helper/type";
import dynamic from "next/dynamic";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
import { getDramaData, getTVDetails } from "@/app/actions/tvActions";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
const Reviews = dynamic(() => import("./Reviews"));
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
    const title = `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )}) | Reviews`;
    const url = `${process.env.BASE_URL}/tv/${tvDetails?.id}-${spaceToHyphen(
      tvDetails?.name
    )}/reviews`;
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
