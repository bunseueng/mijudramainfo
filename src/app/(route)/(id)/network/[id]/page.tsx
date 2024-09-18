import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const Network = dynamic(() => import("./Network"), { ssr: false });

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const network_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/network/${network_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const network = await response.json();

  return {
    title: `TV Shows on ${network?.name}`,
    description: `All TV Shows of ${network?.name}`,
  };
}

const NetworkPage = ({ params }: { params: { id: string } }) => {
  return <Network network_id={params?.id} />;
};

export default NetworkPage;
