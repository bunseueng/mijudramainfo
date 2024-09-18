import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const NewestMovie = dynamic(() => import("./NewestMovie"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const revalidate = 0;
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
