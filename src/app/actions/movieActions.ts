import prisma from "@/lib/db";
import { cache } from "react";

export const getMovieDetails = cache(async (movie_id: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
})

export const getMovieData = cache(async (movie_id: string, userId: string | undefined)=>  {
  const users = await prisma.user.findMany({});
  const getAllMovie = await prisma.movie.findMany();
  const getMovie = await prisma.movie.findUnique({ where: { movie_id: movie_id } });
  const getComment = await prisma.comment.findMany({ where: { postId: movie_id } });
  const watchlist = userId ? await prisma.watchlist.findMany({ where: { userId } }) : [];
  const lists = await prisma.dramaList.findMany({});
  const existedWatchlist = watchlist.find((item: any) => 
    item.movieId.some((movie: any) => movie.id === parseInt(movie_id))
  );
  const existedFavorite = watchlist.find((item: any) => 
    item.favoriteIds.some((movie: any) => movie.id === parseInt(movie_id))
  );
  const userRating = userId ? await prisma.rating.findMany({ where: { userId, movieId: movie_id } }) : [];
  const existingRatings = await prisma.rating.findMany({ where: { movieId: movie_id } });
  const getReview = await prisma.movieReview.findMany({ where: { movie_id: movie_id } });
  return {
    users,
    getMovie,
    getComment,
    lists,
    existedWatchlist,
    existedFavorite,
    userRating,
    existingRatings,
    getReview,
    getAllMovie
  };
})