"use server";

import { ITvReview } from "@/helper/type";
import prisma from "@/lib/db";
import moment from "moment";
import { getCurrentUser } from "./getCurrentUser";

export const getProfileData = async (name?: string) => {
  try {
    // Return early if no name is provided
    if (!name) {
      return null;
    }

    const user = await prisma?.user?.findUnique({ where: { name } });
    
    // Return early if no user is found
    if (!user) {
      return null;
    }

    const users = await prisma?.user?.findMany({});
    const currentUser = await getCurrentUser();
    
    const createdAt = user?.createdAt;
    let formattedDate = "";
    
    if (createdAt) {
      const date = new Date(createdAt);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split("T")[0];
      }
    }

    const lists = await prisma.dramaList.findMany({
      where: {
        userId: user?.id,
      },
    });
    
    const formattedLists = lists.map((list) => ({
      ...list,
      tvId: list.tvId.flat(),
      movieId: list.movieId.flat(),
    }));
    
    const watchlist = await prisma?.watchlist?.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "asc" },
    });

    const tvid = formattedLists?.map((item: any) => item?.tvId);
    const tv_id = watchlist?.map((id: any) => id?.tvId).flat();
    const movie_id = watchlist?.map((id: any) => id?.movieId).flat();
    const existedFavorite = watchlist
      ?.map((id: any) => id?.favoriteIds?.map((item: any) => item?.id))
      ?.flat();

    const lastLogin = user?.lastLogin
      ? moment(user?.lastLogin).fromNow()
      : "Unknown";

    const findFriendId = await prisma.friend?.findFirst({
      where: {
        friendRequestId: currentUser?.id as string,
        friendRespondId: user?.id as string,
      },
    });

    const friends = await prisma?.friend?.findMany({
      where: {
        OR: [{ friendRequestId: user?.id }, { friendRespondId: user?.id }],
      },
    });
    
    const friend = await prisma.friend.findMany({});
    const getDrama = await prisma.drama.findMany({});
    const getReview = await prisma.tvReview.findMany({
      where: { userId: user?.id },
    });
    
    const getFeeds = await prisma.feeds.findMany({
      where: {
        username: name,
      },
    });
    
    const getUniqueFeed = await prisma.feeds.findUnique({
      where: {
        username: name,
      },
    });
    
    const getComment = await prisma.comment.findMany({
      where: {
        postId: getUniqueFeed?.id,
      },
    });
    
    const comment = await prisma.comment.findMany({});

    const formattedReviews: ITvReview[] = getReview.map((review) => ({
      ...review,
      review: review?.review as ITvReview["review"],
      rating_score: review.rating_score as ITvReview["rating_score"],
      userInfo: review.userInfo as ITvReview["userInfo"],
      overall_score: review.overall_score ? Number(review.overall_score) : 0,
      reviewBy: review.reviewBy as ITvReview["reviewBy"],
      updatedAt: review.updatedAt.toISOString(),
      createdAt: review.createdAt,
    }));

    const findSpecificUser = users.filter((user: any) =>
      friend.map((friend: any) => friend.friendRequestId).includes(user.id)
    );
    
    const yourFriend = users.filter((user: any) =>
      friend.map((friend: any) => friend.friendRespondId).includes(user.id)
    );

    return {
      user,
      users,
      currentUser,
      tv_id,
      movie_id,
      existedFavorite,
      formattedLists,
      tvid,
      formattedDate,
      lastLogin,
      findFriendId,
      friends,
      getDrama,
      formattedReviews,
      getFeeds,
      getComment,
      friend,
      comment,
      findSpecificUser,
      yourFriend
    };
  } catch (error) {
    console.error("Profile data fetch error:", error);
    return null;
  }
}