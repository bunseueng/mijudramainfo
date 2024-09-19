import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import NewestDrama from "./NewestDrama";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
};

const NewestDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <NewestDrama />
      </Suspense>
    </div>
  );
};

export default NewestDramaPage;
