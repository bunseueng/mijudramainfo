import React from "react";
import prisma from "@/lib/db";
import MovieVideo from "./MovieVideo";

const MovieVideoPage = async ({ params }: any) => {
  const movie_id = params.id;
  const movieDB = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  const getMovie = await prisma.movie.findMany();
  return (
    <MovieVideo movie_id={movie_id} movieDB={movieDB} getMovie={getMovie} />
  );
};

export default MovieVideoPage;
