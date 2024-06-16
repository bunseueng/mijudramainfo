import React, { Suspense } from "react";
import NewestDrama from "./NewestDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import ErrorBoundary from "@/app/component/ui/Loading/ErrorBoundary";

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
};

const NewestDramaPage = () => {
  return (
    <div className="mt-10">
      <ErrorBoundary>
        <Suspense fallback={<SearchLoading />}>
          <NewestDrama />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default NewestDramaPage;
