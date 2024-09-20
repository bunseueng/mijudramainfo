import React from "react";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import WriteReview from "./WriteReview";

export const metadata: Metadata = {
  title: "New Review",
  description: "Create review for TVShows.",
};

export const maxDuration = 60;

const WriteReviewPage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params?.id;
  const currentUser = await getCurrentUser();
  return <WriteReview tv_id={tv_id} currentUser={currentUser} />;
};

export default WriteReviewPage;
