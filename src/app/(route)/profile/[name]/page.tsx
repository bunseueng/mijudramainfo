import React, { Suspense } from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import moment from "moment";
import { ITvReview } from "@/helper/type";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import ProfileItem from "./ProfileItem";
export const revalidate = 0;
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const maxDuration = 60;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Profile`,
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

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
  const watchlist = await prisma?.watchlist?.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "asc" },
  });

  const tvid = formattedLists?.map((item: any) => item?.tvId);
  const tv_id = watchlist?.map((id: any) => id?.tvId).flat(); // Flatten the array of arrays
  const movie_id = watchlist?.map((id: any) => id?.movieId).flat(); // Flatten the array of arrays
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
      OR: [{ friendRequestId: user?.id }, { friendRespondId: user?.id }],
    },
  });
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
        <div className="my-10">
          <Suspense key={params?.name} fallback={<SearchLoading />}>
            <ProfileItem
              user={user as any}
              users={users}
              currentUser={currentUser}
              tv_id={tv_id as any}
              movieId={movie_id as any}
              existedFavorite={existedFavorite}
              list={formattedLists}
              tvid={tvid}
              formattedDate={formattedDate}
              lastLogin={lastLogin}
              findFriendId={findFriendId}
              friend={friends}
              getDrama={getDrama as any}
              getReview={formattedReviews}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
