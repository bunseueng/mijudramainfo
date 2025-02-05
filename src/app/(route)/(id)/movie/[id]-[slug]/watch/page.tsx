import { notFound } from "next/navigation";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { MovieDB } from "@/helper/type";
import { Metadata } from "next";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { getMovieData, getMovieDetails } from "@/app/actions/movieActions";
import WatchMovie from "./WatchMovie";

export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [movie_id] = params["id]-[slug"].split("-");
  const tvDetails = await getMovieDetails(movie_id);
  const original_country = tvDetails?.origin_country?.[0];

  const countryToLanguageMap: { [key: string]: string } = {
    CN: "Chinese",
    KR: "Korean",
    JP: "Japanese",
    TW: "Taiwanese",
    TH: "Thai",
  };
  const languageName = countryToLanguageMap[original_country] || "Unknown";
  const url = `${process.env.BASE_URL}/tv/${tvDetails?.id}-${spaceToHyphen(
    tvDetails?.title
  )}/watch`;

  return {
    title: `Watch ${tvDetails?.title} (${languageName} Movie ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data?.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: tvDetails?.title,
      description: tvDetails?.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function WatchPage(props: {
  params: Promise<{ "id]-[slug": string }>;
}) {
  const params = await props.params;
  const slug = params["id]-[slug"];

  if (!slug) {
    notFound();
  }
  const [movie_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const { getMovie } = await getMovieData(movie_id, user?.id);
  return (
    <div className="min-h-screen bg-background">
      <WatchMovie movie_id={movie_id} getMovie={getMovie as MovieDB | null} />
    </div>
  );
}
