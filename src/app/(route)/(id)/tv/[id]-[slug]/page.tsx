import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import DramaMain from "./DramaMain";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getTVDetails, getDramaData } from "@/app/actions/tvActions";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

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
    const original_country = tvDetails?.origin_country?.[0];

    const countryToLanguageMap: { [key: string]: string } = {
      CN: "Chinese",
      KR: "Korean",
      JP: "Japanese",
      TW: "Taiwanese",
      TH: "Thai",
    };
    const languageName = countryToLanguageMap[original_country] || "Unknown";
    const title = `${tvDetails?.name} ( ${languageName} Drama ${
      getYearFromDate(tvDetails?.first_air_date || tvDetails?.release_date) ||
      ""
    })`;
    const url = `${process.env.BASE_URL}/tv/${tvDetails?.id}-${spaceToHyphen(
      tvDetails?.name
    )}`;
    return {
      title,
      description: tvDetails?.overview,
      keywords: tvDetails?.genres?.map((data: any) => data.name),
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "website",
        url: url,
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
  const slug = params["id]-[slug"];

  if (!slug) {
    notFound();
  }

  try {
    const [tv_id] = slug.split("-");

    // Get user data with error handling
    let user = null;
    try {
      user = await getCurrentUser();
    } catch (authError) {
      console.error("Authentication error:", authError);
      // Continue without user data
    }

    // Get drama data with retry logic
    const getDramaDataWithRetry = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await getDramaData(tv_id, user?.id);
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    const dramaData = await getDramaDataWithRetry();

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
