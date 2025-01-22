import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import DramaMain from "./DramaMain";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import {
  getTVDetails,
  getLanguages,
  getDramaData,
} from "@/app/actions/tvActions";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getYearFromDate } from "@/app/actions/getYearFromDate";

export const maxDuration = 60;
export const revalidate = 3600;

export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    return { title: "TV Drama Not Found" };
  }

  try {
    const [tv_id] = params["id]-[slug"].split("-");
    const tvDetails = await getTVDetails(tv_id);
    const languages = await getLanguages();

    const original_country = tvDetails?.origin_country?.[0];
    const matchedCountry = languages?.find(
      (lang: any) => lang?.iso_3166_1 === original_country
    );

    const countryToLanguageMap: { [key: string]: string } = {
      CN: "Chinese",
      KR: "Korean",
      JP: "Japanese",
      TW: "Taiwanese",
      TH: "Thai",
    };

    const languageName =
      countryToLanguageMap[original_country] ||
      matchedCountry?.english_name ||
      "Unknown";

    const title = `${tvDetails?.name} (${languageName} Drama ${getYearFromDate(
      tvDetails?.first_air_date || tvDetails?.release_date
    )})`;

    return {
      title,
      description: tvDetails?.overview,
      keywords: tvDetails?.genres?.map((data: any) => data.name),
      openGraph: {
        type: "website",
        url: `https://mijudramainfo.vercel.app/tv/${tvDetails?.id}`,
        title: tvDetails?.name,
        description: tvDetails?.overview,
        siteName: "MijuDramaInfo",
        images: [
          {
            url: `https://image.tmdb.org/t/p/original/${tvDetails?.backdrop_path}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "There was an error loading the TV drama information.",
    };
  }
}

export default async function tvPage(props: {
  params: Promise<{ "id]-[slug": string }>;
}) {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    notFound();
  }

  try {
    const [tv_id] = params["id]-[slug"].split("-");
    const user = await getCurrentUser();
    const dramaData = await getDramaData(tv_id, user?.id);
    // Add an artificial delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      <Suspense key={tv_id} fallback={<SearchLoading />}>
        <DramaMain tv_id={tv_id} user={user} {...dramaData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading TV page:", error);
    notFound();
  }
}
