import React, { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { notFound } from "next/navigation";
import MovieGenre from "./MovieGenre";
import { Metadata } from "next";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params["id]-[slug"];
  const [genre_id, slug_name] = slug.split("-");
  const url = `${process.env.BASE_URL}/genre/${genre_id}-${spaceToHyphen(
    slug_name
  )}/movie`;

  return {
    title: slug_name,
    description: `Explore Movie of keyword (${slug_name}) and more...`,
    keywords: slug_name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: slug_name,
      description: `Explore Movie of keyword (${slug_name}) and more...`,
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

const MovieGenrePage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  const slug = params["id]-[slug"];
  const [genre_id] = slug.split("-");

  if (!slug) {
    notFound();
  }

  return (
    <Suspense key={genre_id} fallback={<SearchLoading />}>
      <MovieGenre genre_id={genre_id} />
    </Suspense>
  );
};

export default MovieGenrePage;
