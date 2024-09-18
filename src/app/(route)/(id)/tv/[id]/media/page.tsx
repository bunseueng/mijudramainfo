import { Suspense } from "react";
import dynamic from "next/dynamic";
const MediaPhoto = dynamic(() => import("./Media"), { ssr: false });

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
    <Suspense fallback={<div>Loading...</div>}>
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
