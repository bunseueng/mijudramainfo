import { Suspense } from "react";
import MediaPhoto from "./Media";

const MediaPage = ({
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
    <Suspense key={tv_id} fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default MediaPage;
