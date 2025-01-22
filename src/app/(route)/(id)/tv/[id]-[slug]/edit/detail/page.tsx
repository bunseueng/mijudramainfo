import React, { Suspense } from "react";
import prisma from "@/lib/db";
import TvEditList from "../detail/TvEditList";
import TvEdit from "../detail/TvEdit";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { Metadata } from "next";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getDramaData } from "@/app/actions/tvActions";

export const maxDuration = 60;
export const revalidate = 3600;
export async function generateMetadata(
  props: {
    params: Promise<{ "id]-[slug": string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }

  const [tv_id] = params["id]-[slug"].split("-");
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const tvDetails = await response.json();
  const original_country = tvDetails?.origin_country?.[0];
  const getLanguage = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const language = await getLanguage.json();
  const matchedCountry = language?.find(
    (lang: any) => lang?.iso_3166_1 === original_country
  );

  const countryToLanguageMap: { [key: string]: string } = {
    China: "Chinese",
    Korea: "Korean",
    Japan: "Japanese",
    Taiwan: "Taiwanese",
    Thai: "Thailand",
    // Add more mappings as needed
  };
  // Get the language name
  const languageName =
    countryToLanguageMap[matchedCountry?.english_name] ||
    matchedCountry?.english_name;

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return {
    title: `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})'s Edit`,
    description: tvDetails?.overview,
    keywords: tvDetails?.genres?.map((data: any) => data.name),
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/tv/${tvDetails?.id}`,
      title: tvDetails?.name,
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
const PrimaryDetailsPage = async (
  props: {
    params: Promise<{ "id]-[slug": string }>;
  }
) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("TV ID and slug are missing.");
  }
  const [tv_id] = params["id]-[slug"].split("-");
  const user = await getCurrentUser();
  const { getDrama } = await getDramaData(tv_id, user?.id);
  return (
    <Suspense key={tv_id} fallback={<SearchLoading />}>
      <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
        <TvEdit tv_id={tv_id} />
        <TvEditList tv_id={tv_id} tvDetails={getDrama} />
      </div>
    </Suspense>
  );
};

export default PrimaryDetailsPage;
