import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import WatchCard from "@/app/component/ui/Watch/WatchCard";
import { Metadata } from "next";
import React, { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${process.env.BASE_URL}/watch/tv`;
  return {
    title: "Watch Movie Online With English Subtitles For Free",
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: "Watch Movie Online With English Subtitles For Free",
      siteName: "MijuDramaInfo",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
const WatchMovePage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <WatchCard title="Movie" type="movie" genre="14" />
    </Suspense>
  );
};

export default WatchMovePage;
