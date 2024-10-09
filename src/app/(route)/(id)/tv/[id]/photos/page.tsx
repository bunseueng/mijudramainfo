import React from "react";
import PhotoAlbum from "./PhotoAlbum";
import prisma from "@/lib/db";

const PhotosPage = async ({ params }: { params: { id: string } }) => {
  const getDrama = await prisma.drama.findMany();
  const tv_id = params.id;
  return <PhotoAlbum tv_id={tv_id} getDrama={getDrama} />;
};

export default PhotosPage;
