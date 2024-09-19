import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import NewestMovie from "./NewestMovie";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Newest Movie",
  description: "Find Newest movie.",
};

const NewestMoviePage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <NewestMovie />
      </Suspense>
    </div>
  );
};

export default NewestMoviePage;
