import React from "react";
import WriteReview from "./WriteReview";
import { Metadata } from "next";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export const metadata: Metadata = {
  title: "New Review",
  description: "Create review for TVShows.",
};
const WriteReviewPage = async ({ params }: { params: { id: string } }) => {
  const tv_id = params?.id;
  const currentUser = await getCurrentUser();
  return <WriteReview tv_id={tv_id} currentUser={currentUser} />;
};

export default WriteReviewPage;
