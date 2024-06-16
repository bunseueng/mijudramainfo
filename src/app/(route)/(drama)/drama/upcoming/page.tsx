import React, { Suspense } from "react";
import UpcomingDrama from "./UpcomingDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Upcoming Drama",
  description: "Find Upcoming drama.",
};

const UpcomingDramaPage = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <UpcomingDrama />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default UpcomingDramaPage;
