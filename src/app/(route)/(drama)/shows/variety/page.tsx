import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import VarietyShow from "./VarietyShow";
const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

export const revalidate = 0;

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
