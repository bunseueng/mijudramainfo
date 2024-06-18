import React, { Suspense } from "react";
import NewestDrama from "./NewestDrama";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

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
