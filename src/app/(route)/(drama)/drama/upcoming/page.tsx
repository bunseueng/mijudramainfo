import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import UpcomingDrama from "./UpcomingDrama";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Upcoming Drama",
  description: "Find Upcoming drama.",
};

const UpcomingDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <UpcomingDrama />
      </Suspense>
    </div>
  );
};

export default UpcomingDramaPage;
