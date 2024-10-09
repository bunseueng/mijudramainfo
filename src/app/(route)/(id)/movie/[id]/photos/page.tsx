import React from "react";
import PhotoAlbum from "./PhotoAlbum";
import prisma from "@/lib/db";

const MoviePhotosPage = async () => {
  const getMovie = await prisma.movie.findMany();
  return <PhotoAlbum getMovie={getMovie} />;
};

export default MoviePhotosPage;
