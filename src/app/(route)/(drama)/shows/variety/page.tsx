import React, { Suspense } from "react";
import VarietyShow from "./VarietyShow";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const metadata: Metadata = {
  title: "Variety Show",
  description: "Find Variety Show.",
};

const VarietyShowPage = () => {
  return (
    <div className="mt-10">
      <Suspense fallback={<SearchLoading />}>
        <VarietyShow />
      </Suspense>
    </div>
  );
};

export default VarietyShowPage;
