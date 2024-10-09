import React from "react";
import { Metadata } from "next";
import TvKeyword from "./TvKeyword";

export const revalidate = 3600;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const keyword_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/keyword/${keyword_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const keyword = await response.json();

  return {
    title: `${keyword?.name}`,
    description: `All TV Shows of keyword ${keyword?.name}`,
    openGraph: {
      type: "website",
      url: "https://mijudramainfo.vercel.app/",
      title: keyword?.name,
      description: `All Tv Shows of ${keyword?.name}`,
      images: [
        {
          url: `/opengraph-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const KeywordPage = ({ params }: { params: { id: string } }) => {
  return <TvKeyword keyword_id={params?.id} />;
};

export default KeywordPage;
