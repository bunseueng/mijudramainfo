import MediaPhoto from "./Media";

export const MediaPage = ({
  tv,
  mediaActive,
  setMediaActive,
  image,
  video,
  thumbnails,
  openTrailer,
  setOpenTrailer,
  tv_id,
}: any) => {
  return (
    <MediaPhoto
      tv={tv}
      mediaActive={mediaActive}
      setMediaActive={setMediaActive}
      image={image}
      video={video}
      thumbnails={thumbnails}
      openTrailer={openTrailer}
      setOpenTrailer={setOpenTrailer}
      tv_id={tv_id}
    />
  );
};
