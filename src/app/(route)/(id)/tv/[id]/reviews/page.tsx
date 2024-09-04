import React from "react";
import Reviews from "./Reviews";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ITvReview } from "@/helper/type";

const ReviewsPage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params?.id;
  const getDrama = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  const getReview = await prisma.tvReview.findMany({
    where: { tv_id: tv_id },
  });
  const currentUser = await getCurrentUser();
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
      getDrama={getDrama}
      getReview={formattedReviews}
      currentUser={currentUser}
    />
  );
};

export default ReviewsPage;
