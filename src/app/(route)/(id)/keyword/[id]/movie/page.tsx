import React, { Suspense } from "react";
import { Metadata } from "next";
import MovieKeyword from "./MovieKeyword";
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
    description: `All Movie of keyword ${keyword?.name}`,
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/${keyword_id}/movie`,
      title: keyword?.name,
      description: `All Movie of ${keyword?.name}`,
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

const MovieKeywordPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={params.id} fallback={<SearchLoading />}>
      <MovieKeyword keyword_id={params?.id} />
    </Suspense>
  );
};

export default MovieKeywordPage;
