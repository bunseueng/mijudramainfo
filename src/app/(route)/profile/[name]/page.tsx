import React from "react";
import CoverPhoto from "./CoverPhoto";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import ProfileItem from "./ProfileItem";
import moment from "moment";
import { ITvReview } from "@/helper/type";

const ProfilePage = async ({ params }: { params: { name: string } }) => {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  const users = await prisma?.user?.findMany({});
  const currentUser = await getCurrentUser();
  const date = new Date(user?.createdAt as Date);
  const formattedDate = date?.toISOString()?.split("T")[0];
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

  const tvid = formattedLists?.map((item: any) => item?.tvId);
  const movieId = formattedLists?.map((item: any) => item?.movieId);

  const watchlist = await prisma?.watchlist?.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "asc" },
  });

  const tv_id = watchlist?.map((id: any) => id?.movieId).flat(); // Flatten the array of arrays
  const existedFavorite = watchlist
    ?.map((id: any) => id?.favoriteIds?.map((item: any) => item?.id))
    ?.flat(); // Flatten the array of arrays

  const lastLogin = user?.lastLogin
    ? moment(user?.lastLogin).fromNow()
    : "Unknown"; // or any other fallback value you'd like to show

  const findFriendId = await prisma.friend?.findFirst({
    where: {
      friendRequestId: currentUser?.id as string,
      friendRespondId: user?.id as string,
    },
  });

  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [
        { friendRequestId: currentUser?.id },
        { friendRespondId: currentUser?.id },
      ],
    },
  });

  const yourFriend = users?.filter((user: any) =>
    friends?.map((friend: any) => friend?.friendRespondId).includes(user?.id)
  );

  const getDrama = await prisma.drama.findMany({});
  const getReview = await prisma.tvReview.findMany({
    where: { userId: user?.id },
  });
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
    <main className="overflow-hidden">
      <div className="relative">
        <CoverPhoto user={user} users={users} currentUser={currentUser} />
        <div className="my-10">
          <ProfileItem
            user={user}
            users={users}
            currentUser={currentUser}
            tv_id={tv_id as any}
            existedFavorite={existedFavorite}
            list={formattedLists}
            movieId={movieId}
            tvid={tvid}
            formattedDate={formattedDate}
            lastLogin={lastLogin}
            findFriendId={findFriendId}
            friend={friends}
            yourFriend={yourFriend}
            findSpecificUser={[]}
            getDrama={getDrama as any}
            getReview={formattedReviews}
          />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
