import prisma from "@/lib/db";
import React from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import Lists from "./Lists";

const ListsPage = async (props: { params: Promise<{ listId: string }> }) => {
  const params = await props.params;
  const list = await prisma.dramaList?.findUnique({
    where: {
      listId: params.listId,
    },
  });

  const currentUser = await getCurrentUser();
  const user = await prisma.user?.findUnique({ where: { id: list?.userId } });

  const ratings = await prisma.rating?.findMany({
    where: {
      userId: list?.userId,
      tvId: { in: list?.tvId.map(String) }, // Convert tvId to an array of strings
    },
  });

  const findSpecificRating =
    list?.tvId?.map((tvId: number) => {
      const rating = ratings.find((rating) => rating?.tvId === String(tvId));
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

  const userRating = await prisma.rating?.findMany({
    where: { userId: currentUser?.id },
  });

  const yourRating = await prisma.rating?.findMany();

  return (
    <Lists
      list={list}
      user={user}
      findSpecificRating={findSpecificRating}
      userRating={userRating}
      yourRating={yourRating}
      currentUser={currentUser}
    />
  );
};

export default ListsPage;
