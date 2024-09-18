import prisma from "@/lib/db";
import React from "react";
import dynamic from "next/dynamic";
const MovieVideo = dynamic(() => import("../MovieVideo"), { ssr: false });

const BloopersPage = async ({ params }: any) => {
  const movie_id = params.id;
  const movieDB = await prisma.movie.findUnique({
    where: { movie_id: movie_id },
  });
  return <MovieVideo movie_id={movie_id} movieDB={movieDB} />;
};

export default BloopersPage;
