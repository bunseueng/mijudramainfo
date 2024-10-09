import React from "react";
import AllMovieCast from "./AllMovieCast";
import prisma from "@/lib/db";

const AllMovieCastPage = async ({ params }: any) => {
  const movie_id = params.id;
  const getMovie = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  return (
    <div>
      <AllMovieCast movie_id={movie_id} getMovie={getMovie} />
    </div>
  );
};

export default AllMovieCastPage;
