import React, { Suspense } from "react";
import { Metadata } from "next";
import Network from "./Network";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const revalidate = 3600;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const network_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/network/${network_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const network = await response.json();

  return {
    title: `TV Shows on ${network?.name}`,
    description: `All TV Shows of ${network?.name}`,
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/network/${network?.id}`,
      title: network?.name,
      description: `All information of ${network?.name}`,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${network?.logo_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const NetworkPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={params?.id} fallback={<SearchLoading />}>
      <Network network_id={params?.id} />
    </Suspense>
  );
};

export default NetworkPage;
