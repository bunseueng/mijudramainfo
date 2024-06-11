import React, { Suspense } from "react";
import NewestDrama from "./NewestDrama";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Newest Drama",
  description: "Find Newest drama.",
};

const NewestDramaPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <NewestDrama />
      </Suspense>
    </div>
  );
};

export default NewestDramaPage;
