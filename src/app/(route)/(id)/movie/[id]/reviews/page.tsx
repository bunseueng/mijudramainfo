import React from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { IMovieReview } from "@/helper/type";
import MovieReview from "./MovieReview";

const MovieReviewsPage = async ({ params }: { params: { id: string } }) => {
  const movie_id = params?.id;
  const getMovie = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  const getReview = await prisma.movieReview.findMany({
    where: { movie_id: movie_id },
  });
  const currentUser = await getCurrentUser();
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
