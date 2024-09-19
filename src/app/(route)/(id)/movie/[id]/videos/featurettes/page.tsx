import prisma from "@/lib/db";
import React from "react";
import MovieVideo from "../MovieVideo";

const FeaturettesPage = async ({ params }: any) => {
  const movie_id = params.id;
  const movieDB = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  return <MovieVideo movie_id={movie_id} movieDB={movieDB} />;
};

export default FeaturettesPage;
