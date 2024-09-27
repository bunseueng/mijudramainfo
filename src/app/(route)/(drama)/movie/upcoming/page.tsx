import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const UpcomingMovie = dynamic(() => import("./UpcomingDrama"), { ssr: false });
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Upcoming Movie",
  description: "Find Upcoming movie.",
};

const UpcomingDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingMovie />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
