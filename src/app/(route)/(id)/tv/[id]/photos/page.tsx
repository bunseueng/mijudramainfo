import React from "react";
import dynamic from "next/dynamic";
const PhotoAlbum = dynamic(() => import("./PhotoAlbum"));

const PhotosPage = () => {
  return <PhotoAlbum />;
};

export default PhotosPage;
