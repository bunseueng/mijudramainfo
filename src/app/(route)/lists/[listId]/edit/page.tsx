import React from "react";
import EditList from "./EditList";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const EditListPage = async ({ params }: { params: { listId: string } }) => {
  const user = await getCurrentUser();
  const list = await prisma.dramaList.findUnique({
    where: { listId: params.listId },
  });

  const ratings = await prisma.rating.findMany({
    where: {
      userId: list?.userId,
      tvId: { in: list?.tvId.map(String) }, // Convert tvId to an array of strings
    },
  });

  const findSpecificRating =
    list?.tvId.map((tvId: number) => {
      const rating = ratings.find((rating) => rating.tvId === String(tvId));
      return {
        tvId: String(tvId),
        rating: rating || {
          id: "",
          userId: "",
          rating: 0,
          mood: "",
          emojiImg: "",
          movieId: null,
          tvId: String(tvId),
          status: "",
          episode: "",
          notes: "",
          user: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }) || [];

  const yourRating = await prisma.rating.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div>
      {user?.id === list?.userId ? (
        <EditList
          list={list}
          yourRating={yourRating}
          findSpecificRating={findSpecificRating}
          submittedData={null}
        />
      ) : (
        <div className="h-screen flex items-center justify-center">
          You cannot access to this page!
        </div>
      )}
    </div>
  );
};

export default EditListPage;
