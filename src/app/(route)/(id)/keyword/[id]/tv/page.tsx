import React, { Suspense } from "react";
import { Metadata } from "next";
import TvKeyword from "./TvKeyword";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const revalidate = 3600;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
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
      url: `https://mijudramainfo.vercel.app/${keyword_id}/tv`,
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

const KeywordPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={params.id} fallback={<SearchLoading />}>
      <TvKeyword keyword_id={params?.id} />
    </Suspense>
  );
};

export default KeywordPage;
