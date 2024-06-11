import { Suspense } from "react";
import DramaMain from "./DramaMain";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export default async function tvPage({ params }: any) {
  const tv_id = params.id;
  const user = await getCurrentUser();
  const users = await prisma.user.findMany({});
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user?.id },
  });

  const existedWatchlist = watchlist.find((item: any) =>
    item.movieId.some((movie: any) => movie.id === parseInt(tv_id))
  );

  const existedFavorite = watchlist.find((item: any) =>
    item.favoriteIds.some((movie: any) => movie.id === parseInt(tv_id))
  );

  const userRating = await prisma.rating.findMany({
    where: { userId: user?.id, tvId: tv_id },
  });

  const existingRatings = await prisma.rating.findMany({
    where: { tvId: tv_id },
  });

  const getComment = await prisma.comment.findMany({
    where: {
      postId: tv_id,
    },
  });

  return (
    <Suspense fallback="loading">
      <DramaMain
        tv_id={tv_id}
        existedWatchlist={existedWatchlist}
        existedFavorite={existedFavorite}
        user={user}
        users={users}
        existingRatings={existingRatings}
        userRating={userRating}
        getComment={getComment}
      />
    </Suspense>
  );
}
