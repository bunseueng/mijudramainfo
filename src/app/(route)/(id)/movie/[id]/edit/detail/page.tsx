import React from "react";
import prisma from "@/lib/db";
import MovieEdit from "./MovieEdit";
import MovieEditList from "./MovieEditList";

export const maxDuration = 60;
export const revalidate = 3600;

const PrimaryDetailsPage = async ({ params }: { params: { id: string } }) => {
  const movie_id = params.id;
  const movieDetails = await prisma.movie.findUnique({
    where: {
      movie_id: movie_id,
    },
  });
  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
      <MovieEdit movie_id={movie_id} />
      <MovieEditList movie_id={movie_id} movieDetails={movieDetails} />
    </div>
  );
};

export default PrimaryDetailsPage;
