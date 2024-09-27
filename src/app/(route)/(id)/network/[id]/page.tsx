import React from "react";
import { Metadata } from "next";
import Network from "./Network";

export const revalidate = 3600;
export async function generateMetadata({ params }: any): Promise<Metadata> {
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
      url: "https://mijudramainfo.vercel.app/",
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

const NetworkPage = ({ params }: { params: { id: string } }) => {
  return <Network network_id={params?.id} />;
};

export default NetworkPage;
