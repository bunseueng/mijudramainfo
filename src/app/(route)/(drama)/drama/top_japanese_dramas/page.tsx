import { Metadata } from "next";
import React, { Suspense } from "react";
import Top100Japanese from "./Top100Japanese";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Top 100 Japanese Dramas",
  description: "Explore our Top 100 Japanese Dramas",
};

const TopJapaneseDrama = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <Top100Japanese />
      </Suspense>
    </div>
  );
};

export default TopJapaneseDrama;
