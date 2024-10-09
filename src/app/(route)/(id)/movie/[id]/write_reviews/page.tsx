import React from "react";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import WriteReview from "./WriteReview";

export const metadata: Metadata = {
  title: "New Review",
  description: "Create review for TVShows.",
};

export const maxDuration = 60;

const WriteMovieReviewPage = async ({ params }: { params: { id: string } }) => {
  const movie_id = params?.id;
  const currentUser = await getCurrentUser();
  return <WriteReview movie_id={movie_id} currentUser={currentUser} />;
};

export default WriteMovieReviewPage;
