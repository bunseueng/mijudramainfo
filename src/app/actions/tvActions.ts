import prisma from "@/lib/db";
import { cache } from "react";

export const getTVDetails = cache(async (tv_id: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  return response.json();
})

export const getLanguages = cache( async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  return response.json();
})

export const getDramaData = cache(async (tv_id: string, userId: string | undefined) => {
  const users = await prisma.user.findMany({});
  const watchlist = await prisma.watchlist.findMany({ where: { userId } });
  const lists = await prisma.dramaList.findMany({});
  const existedWatchlist = watchlist.find((item) => item.tvId.some((tv: any) => tv?.id === parseInt(tv_id)));
  const existedFavorite = watchlist.find((item) => item.favoriteIds.some((movie: any) => movie?.id === parseInt(tv_id)));
  const userRating = await prisma.rating.findMany({ where: { userId, tvId: tv_id } });
  const existingRatings = await prisma.rating.findMany({ where: { tvId: tv_id } });
  const getComment = await prisma.comment.findMany({ where: { postId: tv_id } });
  const getReview = await prisma.tvReview.findMany({ where: { tv_id: tv_id } });
  const getDrama = await prisma.drama.findUnique({ where: { tv_id: tv_id } });
  const getAllDrama = await prisma.drama.findMany();
  return {
    users,
    existedWatchlist,
    existedFavorite,
    userRating,
    existingRatings,
    getComment,
    getReview,
    getDrama,
    lists,
    getAllDrama
  };
})