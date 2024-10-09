import React from "react";
import prisma from "@/lib/db";
import PersonPhotoAlbum from "./PhotoAlbum";

const PhotosPage = async ({ params }: { params: { id: string } }) => {
  const getPerson = await prisma.person.findMany();
  const personId = params.id;
  return <PersonPhotoAlbum personId={personId} getPerson={getPerson} />;
};

export default PhotosPage;
