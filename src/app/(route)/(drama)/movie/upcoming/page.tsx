import React, { Suspense } from "react";
import UpcomingDrama from "./UpcomingDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const metadata: Metadata = {
  title: "Upcoming Movie",
  description: "Find Upcoming movie.",
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
