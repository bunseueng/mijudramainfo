import Image from "next/image";
import React, { Suspense } from "react";
import SearchDrama from "../Search/SearchDrama";

const Header = async () => {
  // const video = await getYoutubeVideo();
  return (
    // <HeaderSlider video={video} />
    <div
      className="relative overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundPosition: "50%",
        backgroundImage: "url('/hero-section-image.jpg')",
        height: "300px",
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsla(0,0%,0%,0.60)] bg-fixed">
        <div className="flex h-full items-start p-10">
          <div className="text-left text-white">
            <h1 className="mt-2 mb-5 text-xl font-bold tracking-tight md:text-2xl xl:text-5xl">
              The best website for find your favorite drama. 😋
            </h1>
            <p className="text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out">
              The reason I created this website just because I love watching
              drama, so I create this to make our life easier. 🤣
            </p>
            <Suspense fallback={<div>Loading...</div>}>
              <SearchDrama />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
