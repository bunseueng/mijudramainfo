import React, { Suspense } from "react";
import VarietyShow from "./VarietyShow";
import { Metadata } from "next";
import ExploreLoading from "@/app/component/ui/Loading/ExploreLoading";

export const metadata: Metadata = {
  title: "Variety Show",
  description: "Find Variety Show.",
};

const VarietyShowPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<ExploreLoading />}>
        <VarietyShow />
      </Suspense>
    </div>
  );
};

export default VarietyShowPage;
