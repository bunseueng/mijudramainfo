import { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const Top100Japanese = dynamic(() => import("./Top100Japanese"), {
  ssr: false,
});
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Top 100 Japanese Dramas",
  description: "Explore our Top 100 Japanese Dramas",
};

const TopJapaneseDrama = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <Top100Japanese />
      </Suspense>
    </div>
  );
};

export default TopJapaneseDrama;
